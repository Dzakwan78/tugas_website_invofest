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
  const [pembicaraId, setPembicaraId] = useState<number>(1); // Simpan ID pembicara asli

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [resCat, resEvent] = await Promise.all([
          fetch(CATEGORY_URL),
          fetch(`${BASE_URL}/${id}`)
        ]);
        
        if (!resCat.ok || !resEvent.ok) throw new Error("Gagal mengambil data");

        const cats = await resCat.json();
        const event = await resEvent.json();

        setCategories(cats);
        setPembicaraId(event.pembicaraId || 1); // Simpan ID pembicara asli dari event
        
        reset({
          name: event.name,
          categoryId: String(event.categoryId),
          date: new Date(event.dateEvent).toISOString().split("T")[0],
          location: event.location,
          description: event.description,
        });
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data.");
        navigate("/dashboard/event");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        dateEvent: new Date(data.date).toISOString(), // Pastikan format ISO
        location: data.location,
        categoryId: Number(data.categoryId),
        pembicaraId: Number(pembicaraId), // Pakai ID asli, bukan hardcode 1
        description: data.description,
      };

      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal mengupdate");
      }
      
      alert("Event berhasil diupdate!");
      navigate("/dashboard/event");
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : String(err);
      alert(`Gagal: ${message}`);
    }
  };

  if (isLoading) return <div className="text-center mt-10">Memuat data...</div>;

  return (
    // ... JSX kamu tetap sama, pastikan struktur form sesuai
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-4 text-[#7B1D3F]">Edit Event</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register("name")} className="border p-3 rounded-lg" placeholder="Nama Event" />
        <select {...register("categoryId")} className="border p-3 rounded-lg">
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.nama}</option>)}
        </select>
        <input type="date" {...register("date")} className="border p-3 rounded-lg" />
        <input {...register("location")} className="border p-3 rounded-lg" placeholder="Lokasi" />
        <textarea {...register("description")} className="border p-3 rounded-lg" placeholder="Deskripsi" />
        <button disabled={isSubmitting} className="bg-[#7B1D3F] text-white py-3 rounded-lg">
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}