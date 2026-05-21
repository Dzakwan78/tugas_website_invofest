import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// ===== SERVICE =====
const BASE_URL = "https://backend-invofest-taupe.vercel.app/events";
// PERBAIKAN 1: Sesuaikan tipe data dengan skema asli Prisma & Controller Backend
type Event = {
  id: number;
  name: string;
  location: string;
  dateEvent: string;
  description: string;
  category?: {
    id: number;
    nama: string;
  };
};

const getAllEvents = async (): Promise<Event[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Gagal mengambil data event");
  return res.json();
};

const deleteEvent = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Gagal menghapus event");
  return res.json();
};

// ===== COMPONENT =====
export default function EventIndex() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
    } catch {
      setError("Gagal memuat data event.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus event ini?")) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Gagal menghapus event.");
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
          <h1 className="text-2xl font-bold text-[#1a0a10] tracking-tight">Event</h1>
          <p className="text-sm text-gray-400 mt-1">Kelola semua event Invofest</p>
        </div>

        <Link
          to="/dashboard/event/create"
          className="flex items-center gap-1.5 bg-[#7B1D3F] hover:bg-[#9e2550] text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          <span className="text-base leading-none">+</span>
          Tambah Event
        </Link>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {/* PERBAIKAN 2: Menghapus kolom "Status" karena tidak ada di schema.prisma */}
              {["No", "Nama Event", "Kategori", "Tanggal", "Aksi"].map((h) => (
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
                <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                  Memuat data...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-red-400 text-sm">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && events.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400 text-sm">
                  Belum ada event.
                </td>
              </tr>
            )}

            {!loading && !error && events.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 hover:bg-rose-50/40 transition-colors"
              >
                <td className="px-4 py-3.5 text-sm text-gray-300 w-10">{index + 1}</td>

                <td className="px-4 py-3.5 text-sm font-semibold text-[#1a0a10]">
                  {item.name}
                </td>

                <td className="px-4 py-3.5">
                  <span className="text-xs font-medium bg-rose-50 text-[#7B1D3F] px-2.5 py-1 rounded-full">
                    {/* PERBAIKAN 3: Membaca properti nama dari objek relasi category */}
                    {item.category?.nama || "Tanpa Kategori"}
                  </span>
                </td>

                <td className="px-4 py-3.5 text-sm text-gray-500">
                  {new Date(item.dateEvent).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex gap-2">
                    <Link
                      to={`/dashboard/event/edit/${item.id}`}
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
          <span className="text-xs text-gray-300">Menampilkan {events.length} event</span>
        </div>
      </div>
    </div>
  );
}