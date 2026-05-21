import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Login() {
  const [nim, setNim] = useState("");
  const [nama, setNama] = useState("");
  const [error, setError] = useState("");
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nim.trim() || !nama.trim()) {
      setError("NIM dan Nama Lengkap wajib diisi!");
      return;
    }

    // Eksekusi login ke Zustand Store
    login(nim, nama);
    
    alert(`Selamat datang kembali, ${nama}!`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 lg:px-20">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* SISI KIRI: MASKOT ROBOT INVOFEST */}
        <div className="flex justify-center items-center">
          <img 
            src="https://www.invofest-harkatnegeri.com/assets/Maskot-Hero.png" // ← Sesuaikan dengan jalur file/asset maskot robot kamu
            alt="Invofest Mascot" 
            className="w-full max-w-sm lg:max-w-md object-contain"
          />
        </div>

        {/* SISI KANAN: FORM LOGIN */}
        <div className="w-full max-w-md mx-auto flex flex-col justify-center">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#7B1D3F] tracking-wide">Login</h1>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs mb-4 font-medium text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* INPUT NIM */}
            <div>
              <input
                type="24009009"
                className="w-full border border-gray-400 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1D3F]/20 placeholder-gray-400"
                placeholder="NIM"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
              />
            </div>

            {/* INPUT NAMA */}
            <div>
              <input
                type="Eka Dzakwan Venarindra"
                className="w-full border border-gray-400 p-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7B1D3F]/20 placeholder-gray-400"
                placeholder="Nama Lengkap"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>

            {/* TOMBOL MASUK */}
            <button
              type="submit"
              className="w-full bg-[#7B1D3F] hover:bg-[#631732] text-white py-3.5 rounded-xl font-bold transition text-sm tracking-wide shadow-sm mt-2"
            >
              Masuk
            </button>
          </form>

          {/* FOOTER REGISTRASI */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Belum punya akun?{" "}
              <Link to="/register" className="text-[#7B1D3F] font-semibold hover:underline">
                Registrasi Sekarang
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}