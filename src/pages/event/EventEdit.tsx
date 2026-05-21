import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

const BASE_URL = "https://backend-invofest-taupe.vercel.app/events";
const CATEGORY_URL = "https://backend-invofest-taupe.vercel.app/categories";

const schema = z.object({
  name: z.string().min(3, "Nama event minimal 3 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  date: z.string().min(1, "Tanggal wajib diisi"),
  location: z.string().min(3, "Lokasi minimal 3 karakter"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
});

type FormData = z.infer<typeof schema>;
type Category = { id: number; nama: string };

export default function EventEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch terpisah supaya lebih aman
        const resCat = await fetch(CATEGORY_URL);
        const resEvent = await fetch(`${BASE_URL}/${id}`);
        
        if (!resCat.ok || !resEvent.ok) throw new Error("Data gagal dimuat");

        const cats = await resCat.json();
        const event = await resEvent.json();

        setCategories(cats);
        
        // Memastikan tanggal tidak undefined
        const dateFormatted = event.dateEvent 
          ? new Date(event.dateEvent).toISOString().split("T")[0] 
          : "";

        reset({
          name: event.name,
          categoryId: String(event.categoryId),
          date: dateFormatted,
          location: event.location,
          description: event.description,
        });
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data event.");
        navigate("/dashboard/event");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, reset]);

  if (isLoading) return <div className="text-center mt-10">Memuat data...</div>;

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          dateEvent: data.date,
          location: data.location,
          categoryId: Number(data.categoryId),
          pembicaraId: 1, // HATI-HATI: Sesuaikan dengan id pembicara yang ada
          description: data.description,
        }),
      });
      if (!res.ok) throw new Error("Gagal update");
      alert("Event berhasil diupdate!");
      navigate("/dashboard/event");
    } catch {
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
        
        <input type="date" {...register("date")} className="border p-3 rounded-lg" />
        <input {...register("location")} placeholder="Lokasi" className="border p-3 rounded-lg" />
        <textarea {...register("description")} placeholder="Deskripsi" className="border p-3 rounded-lg" />

        <button disabled={isSubmitting} className="bg-[#7B1D3F] text-white py-3 rounded-lg">
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}