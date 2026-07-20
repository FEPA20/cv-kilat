import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("❌ Login gagal!");
    } else {
      onLogin(data.user.id);
    }
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("❌ Register gagal!");
    } else {
      alert("✅ Register berhasil, silakan login!");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-yellow-400 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

        {/* LOGO */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black font-bold">
            ⚡
          </div>
          <h1 className="text-xl font-bold">
            CV <span className="text-yellow-400">Kilat</span>
          </h1>
        </div>

        <h2 className="text-center text-lg mb-6 text-gray-300">
          Masuk untuk lanjut edit & download CV
        </h2>

        {/* INPUT */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-yellow-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-yellow-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* LOGIN */}
          <button
            onClick={handleLogin}
            className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold hover:scale-105 transition"
          >
            Login
          </button>

          {/* REGISTER */}
          <button
            onClick={handleRegister}
            className="w-full border border-white/20 py-3 rounded-lg hover:bg-white hover:text-black transition"
          >
            Register
          </button>

        </div>

        {/* BACK */}
        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 text-sm text-gray-400 hover:text-white w-full text-center"
          >
            ← Kembali ke Landing
          </button>
        )}

      </div>
    </div>
  );
}