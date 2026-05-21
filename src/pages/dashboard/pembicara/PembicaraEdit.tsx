import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";

// ===== SERVICE =====
// PERBAIKAN: Mengubah URL lokal ke URL Backend Vercel yang sudah live
const BASE_URL = "https://backend-invofest-taupe.vercel.app/pembicara";

type PembicaraPayload = {
  name: string;
  role: string;
  email: string;
  photo?: string;
  bio: string;
  status: string;
};

const getPembicaraById = async (id: number): Promise<PembicaraPayload> => {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Pembicara tidak ditemukan");
  return res.json();
};

const updatePembicara = async (id: number, data: PembicaraPayload) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal mengupdate pembicara");
  return res.json();
};

// ===== SCHEMA =====
const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  role: z.string().min(3, "Role minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  photo: z.string().optional(),
  bio: z.string().min(5, "Bio minimal 5 karakter"),
  status: z.string().min(1, "Status wajib dipilih"),
});

type FormData = z.infer<typeof schema>;

// ===== COMPONENT =====
export default function PembicaraEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Ambil data existing lalu isi ke form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPembicaraById(Number(id));
        reset(data); // ← isi form dengan data yang sudah ada
      } catch {
        alert("Pembicara tidak ditemukan.");
        navigate("/dashboard/pembicara");
      }
    };
    fetchData();
  }, [id, navigate, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      await updatePembicara(Number(id), data);
      alert("Pembicara berhasil diupdate!");
      navigate("/dashboard/pembicara");
    } catch (error) {
      alert("Gagal mengupdate pembicara. Cek koneksi ke server.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Pembicara</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input {...register("name")} placeholder="Nama" className="border p-2 rounded" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

        <input {...register("role")} placeholder="Role" className="border p-2 rounded" />
        {errors.role && <p className="text-red-500">{errors.role.message}</p>}

        <input {...register("email")} placeholder="Email" className="border p-2 rounded" />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        <input {...register("photo")} placeholder="URL Foto (opsional)" className="border p-2 rounded" />

        <textarea {...register("bio")} placeholder="Bio" className="border p-2 rounded" />
        {errors.bio && <p className="text-red-500">{errors.bio.message}</p>}

        <select {...register("status")} className="border p-2 rounded">
          <option value="">Pilih Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Nonaktif</option>
        </select>
        {errors.status && <p className="text-red-500">{errors.status.message}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard/pembicara")}
            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded hover:bg-gray-50 transition"
          >
            Batal
          </button>

          <button
            disabled={isSubmitting}
            className="flex-1 bg-red-600 text-white py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}