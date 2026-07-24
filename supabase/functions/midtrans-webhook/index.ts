import { jsonResponse } from "../_shared/cors.ts";
import { createAdminClient } from "../_shared/supabase.ts";

async function sha512Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-512", bytes);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function mapOrderStatus(
  transactionStatus: string,
  fraudStatus: string,
): string {
  if (transactionStatus === "settlement") return "paid";

  if (
    transactionStatus === "capture" &&
    fraudStatus === "accept"
  ) {
    return "paid";
  }

  if (transactionStatus === "pending") return "pending";
  if (transactionStatus === "cancel") return "cancelled";
  if (transactionStatus === "expire") return "expired";

  if (
    transactionStatus === "refund" ||
    transactionStatus === "partial_refund"
  ) {
    return "refunded";
  }

  return "failed";
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "Method tidak didukung." }, 405);
  }

  try {
    const notification = await req.json();
    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");

    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY belum disimpan.");
    }

    const orderId = String(notification?.order_id || "");
    const statusCode = String(notification?.status_code || "");
    const grossAmount = String(notification?.gross_amount || "");
    const signatureKey = String(notification?.signature_key || "");

    if (!orderId || !statusCode || !grossAmount || !signatureKey) {
      return jsonResponse(
        { error: "Payload notification tidak lengkap." },
        400,
      );
    }

    const expectedSignature = await sha512Hex(
      orderId + statusCode + grossAmount + serverKey,
    );

    if (expectedSignature !== signatureKey.toLowerCase()) {
      console.warn("Signature Midtrans tidak valid:", orderId);
      return jsonResponse({ error: "Signature tidak valid." }, 401);
    }

    const transactionStatus = String(
      notification?.transaction_status || "",
    );
    const fraudStatus = String(
      notification?.fraud_status || "",
    );
    const orderStatus = mapOrderStatus(
      transactionStatus,
      fraudStatus,
    );
    const admin = createAdminClient();

    if (orderStatus === "paid") {
      const { data, error } = await admin.rpc(
        "activate_payment_order",
        {
          p_order_id: orderId,
          p_midtrans_transaction_id:
            notification?.transaction_id || null,
          p_transaction_status: transactionStatus,
          p_payment_type: notification?.payment_type || null,
          p_fraud_status: fraudStatus || null,
          p_gross_amount: Number(grossAmount),
          p_raw_notification: notification,
        },
      );

      if (error) throw new Error(error.message);

      return jsonResponse({
        ok: true,
        status: "paid",
        result: data,
      });
    }

    const { error } = await admin
      .from("payment_orders")
      .update({
        status: orderStatus,
        midtrans_transaction_id:
          notification?.transaction_id || null,
        transaction_status: transactionStatus || null,
        payment_type: notification?.payment_type || null,
        fraud_status: fraudStatus || null,
        raw_notification: notification,
      })
      .eq("order_id", orderId);

    if (error) throw new Error(error.message);

    return jsonResponse({
      ok: true,
      status: orderStatus,
    });
  } catch (error) {
    console.error("midtrans-webhook:", error);

    return jsonResponse(
      {
        error:
          error instanceof Error
            ? error.message
            : "Webhook gagal diproses.",
      },
      500,
    );
  }
});
