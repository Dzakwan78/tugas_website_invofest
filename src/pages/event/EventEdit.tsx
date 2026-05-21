import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

// PERBAIKAN: Menghubungkan endpoint langsung ke backend Vercel yang live
const BASE_URL = "https://backend-invofest-taupe.vercel.app/events";
const CATEGORY_URL = "https://backend-invofest-taupe.vercel.app/categories";

type Category = { id: number; nama: string };

const schema = z.object({
  name: z.string().min(3, "Nama event minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
});

type FormData = z.infer<typeof schema>;

export default function EventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    // Ambil kategori & data event bersamaan
    Promise.all([
      fetch(CATEGORY_URL).then((r) => r.json()),
      fetch(`${BASE_URL}/${id}`).then((r) => r.json()),
    ])
      .then(([cats, event]) => {
        setCategories(cats);
        reset({
          name: event.name,
          categoryId: String(event.categoryId),
          date: new Date(event.dateEvent).toISOString().split("T")[0],
          location: event.location,
          description: event.description,
        });
      })
      .catch(() => {
        alert("Gagal memuat data event.");
        navigate("/dashboard/event");
      });
  }, [id, navigate, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // PERBAIKAN: Menyamakan key body request dengan skema Prisma backend (dateEvent & location)
        body: JSON.stringify({
          name: data.name,
          dateEvent: data.date,
          location: data.location,
          categoryId: Number(data.categoryId),
          description: data.description,
        }),
      });
      if (!res.ok) throw new Error("Gagal");
      alert("Event berhasil diupdate!");
      navigate("/dashboard/event");
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate event.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4 text-[#7B1D3F]">Edit Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register("name")} placeholder="Nama Event" className="border p-3 rounded-lg" />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

        <select {...register("categoryId")} className="border p-3 rounded-lg">
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.nama}</option>
          ))}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm">{errors.categoryId.message}</p>}

        <input type="date" {...register("date")} className="border p-3 rounded-lg" />
        {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}

        <input {...register("location")} placeholder="Lokasi Event" className="border p-3 rounded-lg" />
        {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}

        <textarea {...register("description")} placeholder="Deskripsi Event" className="border p-3 rounded-lg" />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/event")}
            className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            disabled={isSubmitting}
            className="flex-1 bg-[#7B1D3F] hover:bg-[#9e2550] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}