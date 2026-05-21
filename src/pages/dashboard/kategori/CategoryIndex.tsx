import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const BASE_URL = "http://localhost:3000/categories";

type Category = {
  id: number;
  nama: string; // ← Menggunakan 'nama' sesuai schema.prisma
};

const TABLE_HEADERS = ["No", "Nama Kategori", "Aksi"];

export default function CategoryIndex() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(BASE_URL);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setCategories(data);
    } catch {
      setError("Gagal memuat data kategori.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus kategori ini? Semua event terkait mungkin akan terdampak.")) return;
    try {
      const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      alert("Kategori berhasil dihapus!");
    } catch {
      alert("Gagal menghapus kategori.");
    }
  };

  return (
    <div className="px-7 py-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-4 h-0.5 bg-[#7B1D3F] rounded-full inline-block" />
            <span className="text-[10px] font-semibold text-[#7B1D3F] tracking-widest uppercase">
              Manajemen
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1a0a10] tracking-tight">Kategori</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola kategori event Invofest</p>
        </div>

        <Link
          to="/dashboard/kategori/create"
          className="flex items-center gap-1.5 bg-[#7B1D3F] hover:bg-[#9e2550] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Tambah Kategori
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-4 py-2.5 text-left whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-400 text-sm">
                  Memuat data...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={3} className="text-center py-10 text-red-400 text-sm">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && categories.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-10 text-gray-400 text-sm">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="text-3xl">🗂️</span>
                    <p className="font-medium">Belum ada kategori</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && categories.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-rose-50/40 transition-colors">
                <td className="px-4 py-3.5 text-sm text-gray-300 w-10">{index + 1}</td>
                <td className="px-4 py-3.5 text-sm font-semibold text-[#1a0a10]">
                  {item.nama}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/kategori/edit/${item.id}`} // ← Mengarah ke rute edit kustom
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-md border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 border-t border-gray-50">
          <span className="text-xs text-gray-300">
            Menampilkan {categories.length} kategori
          </span>
        </div>
      </div>
    </div>
  );
}