import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

// ===== SERVICE =====
const BASE_URL = "https://backend-invofest-taupe.vercel.app/events";
const CATEGORY_URL = "https://backend-invofest-taupe.vercel.app/categories";
const PEMBICARA_URL = "https://backend-invofest-taupe.vercel.app/pembicara"; // ← PERBAIKAN 1: Sesuaikan route backend

type Category = { id: number; nama: string };
type Pembicara = { id: number; name: string }; // ← PERBAIKAN 2: Gunakan 'name' sesuai prisma

const getCategories = async (): Promise<Category[]> => {
  const res = await fetch(CATEGORY_URL);
  if (!res.ok) throw new Error("Gagal ambil kategori");
  return res.json();
};

const getPembicara = async (): Promise<Pembicara[]> => {
  const res = await fetch(PEMBICARA_URL); // ← PERBAIKAN 3: Panggil URL yang benar
  if (!res.ok) throw new Error("Gagal ambil pembicara");
  return res.json();
};

// ===== SCHEMA =====
const schema = z.object({
  name: z.string().min(3, "Nama event minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  pembicaraId: z.string().min(1, "Pembicara wajib dipilih"), // ← PERBAIKAN 4: Ganti nama key form jadi pembicaraId
  date: z.string().min(1, "Tanggal wajib diisi"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
});

type FormData = z.infer<typeof schema>;

// ===== COMPONENT =====
export default function EventCreate() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [speakers, setSpeakers] = useState<Pembicara[]>([]); 

  useEffect(() => {
    Promise.all([getCategories(), getPembicara()])
      .then(([catData, speakerData]) => {
        setCategories(catData);
        setSpeakers(speakerData);
      })
      .catch(console.error);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          dateEvent: data.date,
          location: data.location,
          categoryId: Number(data.categoryId),
          pembicaraId: Number(data.pembicaraId), // ← PERBAIKAN 5: Kirim key pembicaraId ke controller
          description: data.description,
        }),
      });

      if (!res.ok) throw new Error("Gagal");
      alert("Event berhasil dibuat!");
      navigate("/dashboard/event");
      
    } catch (error) {
      console.error(error);
      alert("Gagal membuat event. Cek koneksi ke server.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4 text-[#7B1D3F]">Tambah Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Input Nama Event */}
        <input {...register("name")} placeholder="Nama Event" className="border p-3 rounded-lg" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        {/* Dropdown Kategori */}
        <select {...register("categoryId")} className="border p-3 rounded-lg">
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nama}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}

        {/* Dropdown Pembicara */}
        <select {...register("pembicaraId")} className="border p-3 rounded-lg">
          <option value="">Pilih Pembicara</option>
          {speakers.map((spk) => (
            // PERBAIKAN 6: Ganti spk.nama menjadi spk.name agar teks namanya muncul
            <option key={spk.id} value={spk.id}>{spk.name}</option>
          ))}
        </select>
        {errors.pembicaraId && <p className="text-red-500 text-sm">{errors.pembicaraId.message}</p>}

        {/* Input Tanggal */}
        <input type="date" {...register("date")} className="border p-3 rounded-lg" />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}

        {/* Input Lokasi */}
        <input {...register("location")} placeholder="Lokasi Event" className="border p-3 rounded-lg" />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}

        {/* Input Deskripsi */}
        <textarea {...register("description")} placeholder="Deskripsi Event" className="border p-3 rounded-lg" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <button
          disabled={isSubmitting}
          className="bg-[#7B1D3F] hover:bg-[#9e2550] text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan Event"}
        </button>
      </form>
    </div>
  );
}