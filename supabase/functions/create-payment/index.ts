import { corsHeaders, jsonResponse } from "../_shared/cors.ts";
import { getPlan } from "../_shared/plans.ts";
import {
  createAdminClient,
  requireUser,
} from "../_shared/supabase.ts";

function createOrderId(): string {
  const time = Date.now().toString(36).toUpperCase();
  const random = crypto.randomUUID().replaceAll("-", "").slice(0, 10);
  return "CVK-" + time + "-" + random.toUpperCase();
}

function midtransEndpoint(): string {
  const production =
    (Deno.env.get("MIDTRANS_IS_PRODUCTION") || "false").toLowerCase() ===
    "true";

  return production
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method tidak didukung." }, 405);
  }

  try {
    const user = await requireUser(req);
    const body = await req.json().catch(() => ({}));
    const plan = getPlan(body?.plan_code);

    if (!plan) {
      return jsonResponse({ error: "Paket pembayaran tidak valid." }, 400);
    }

    const serverKey = Deno.env.get("MIDTRANS_SERVER_KEY");

    if (!serverKey) {
      throw new Error("MIDTRANS_SERVER_KEY belum disimpan.");
    }

    const admin = createAdminClient();
    const orderId = createOrderId();
    const cvId =
      typeof body?.cv_id === "string" && body.cv_id
        ? body.cv_id
        : null;
    const documentName =
      typeof body?.document_name === "string"
        ? body.document_name.slice(0, 120)
        : "CV Kilat";

    const expiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ).toISOString();

    const { data: order, error: insertError } = await admin
      .from("payment_orders")
      .insert({
        order_id: orderId,
        user_id: user.id,
        cv_id: cvId,
        plan_code: plan.code,
        amount: plan.amount,
        status: "pending",
        expires_at: expiresAt,
      })
      .select("id, order_id")
      .single();

    if (insertError || !order) {
      throw new Error(
        insertError?.message || "Gagal membuat payment order.",
      );
    }

    const fullName =
      String(user.user_metadata?.full_name || "").trim() ||
      String(user.email || "Pengguna CV Kilat").split("@")[0];

    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: plan.amount,
      },
      item_details: [
        {
          id: plan.code,
          price: plan.amount,
          quantity: 1,
          name: plan.name,
          category: "CV Service",
        },
      ],
      customer_details: {
        first_name: fullName.slice(0, 50),
        email: user.email || undefined,
      },
      credit_card: {
        secure: true,
      },
      custom_field1: user.id,
      custom_field2: cvId || "",
      custom_field3: documentName,
    };

    const response = await fetch(midtransEndpoint(), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(serverKey + ":"),
      },
      body: JSON.stringify(payload),
    });

    const midtransResult = await response.json().catch(() => ({}));

    if (!response.ok || !midtransResult?.token) {
      await admin
        .from("payment_orders")
        .update({
          status: "failed",
          raw_status_response: midtransResult,
        })
        .eq("id", order.id);

      const message =
        Array.isArray(midtransResult?.error_messages)
          ? midtransResult.error_messages.join(" ")
          : "Midtrans gagal membuat transaksi.";

      return jsonResponse({ error: message }, 502);
    }

    const { error: updateError } = await admin
      .from("payment_orders")
      .update({
        snap_token: midtransResult.token,
        redirect_url: midtransResult.redirect_url || null,
        raw_status_response: midtransResult,
      })
      .eq("id", order.id);

    if (updateError) {
      throw new Error(updateError.message);
    }

    return jsonResponse({
      ok: true,
      order_id: orderId,
      plan_code: plan.code,
      amount: plan.amount,
      token: midtransResult.token,
      redirect_url: midtransResult.redirect_url || null,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan.";

    if (message === "UNAUTHORIZED") {
      return jsonResponse(
        { error: "Silakan login sebelum membeli paket." },
        401,
      );
    }

    console.error("create-payment:", error);
    return jsonResponse({ error: message }, 500);
  }
});
