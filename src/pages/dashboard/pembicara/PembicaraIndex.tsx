import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// ===== SERVICE =====
const BASE_URL = "http://localhost:3000/pembicara";

type Pembicara = {
  id: number;
  name: string;
  job: string;
  email: string;
  photo?: string;
  bio: string;
  status: string;
};

const getAllPembicara = async (): Promise<Pembicara[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Gagal mengambil data pembicara");
  return res.json();
};

const deletePembicara = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Gagal menghapus pembicara");
  return res.json();
};

// ===== AVATAR =====
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#7B1D3F] to-[#c9395e] text-white text-xs font-bold flex items-center justify-center">
      {initials}
    </div>
  );
}

// ===== COMPONENT =====
export default function PembicaraIndex() {
  const [speakers, setSpeakers] = useState<Pembicara[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllPembicara();
      setSpeakers(data);
    } catch {
      setError("Gagal memuat data pembicara.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pembicara ini?")) return;
    try {
      await deletePembicara(id);
      setSpeakers((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Gagal menghapus pembicara.");
    }
  };

  return (
    <div className="px-10 py-10 w-full space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-5 h-0.5 bg-[#7B1D3F]" />
            <span className="text-xs font-semibold text-[#7B1D3F] uppercase tracking-widest">
              Manajemen
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1a0a10]">Pembicara</h1>
          <p className="text-gray-400 mt-1">Kelola pembicara event Invofest</p>
        </div>

        <Link
          to="/dashboard/pembicara/create"
          className="flex items-center gap-2 bg-[#7B1D3F] hover:bg-[#9e2550] text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md transition"
        >
          <span className="text-lg leading-none">+</span>
          Tambah Pembicara
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {["No", "Pembicara", "Pekerjaan", "Email", "Status", "Aksi"].map((h) => (
                <th
                  key={h}
                  className="text-xs font-semibold uppercase tracking-wider text-gray-400 px-5 py-3 text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Loading state */}
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                  Memuat data...
                </td>
              </tr>
            )}

            {/* Error state */}
            {!loading && error && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-red-400 text-sm">
                  {error}
                </td>
              </tr>
            )}

            {/* Empty state */}
            {!loading && !error && speakers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400 text-sm">
                  Belum ada pembicara.
                </td>
              </tr>
            )}

            {/* Data */}
            {!loading && !error && speakers.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-rose-50/40 transition"
              >
                <td className="px-5 py-4 text-sm text-gray-400 w-10">
                  {index + 1}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={item.name} />
                    <span className="font-semibold text-[#1a0a10]">{item.name}</span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span className="text-sm bg-rose-100 text-[#7B1D3F] px-3 py-1 rounded-full font-medium">
                    {item.job}
                  </span>
                </td>

                <td className="px-5 py-4 text-sm text-gray-500">
                  {item.email}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      item.status === "active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status === "active" ? "● Aktif" : "● Nonaktif"}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/pembicara/edit/${item.id}`}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* FOOTER */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
          <span className="text-sm text-gray-400">
            Menampilkan {speakers.length} pembicara
          </span>
        </div>
      </div>
    </div>
  );
}