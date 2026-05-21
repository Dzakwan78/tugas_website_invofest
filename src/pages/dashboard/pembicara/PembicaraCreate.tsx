import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const BASE_URL = "https://backend-invofest-taupe.vercel.app/pembicara";

type PembicaraPayload = {
  name: string;
  role: string;
  email: string;
  photo?: string;
  bio: string;
  status: string;
};

const createPembicara = async (data: PembicaraPayload) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Gagal menyimpan pembicara");
  return res.json();
};

const schema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  role: z.string().min(3, "Role minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  photo: z.string().optional(),
  bio: z.string().min(5, "Bio minimal 5 karakter"),
  status: z.string().min(1, "Status wajib dipilih"),
});

type FormData = z.infer<typeof schema>;

export default function PembicaraCreate() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createPembicara(data);
      alert("Pembicara berhasil ditambahkan!");
      reset();
    } catch (error) {
      alert("Gagal menyimpan pembicara. Cek koneksi ke server.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Tambah Pembicara</h1>

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

        <button
          disabled={isSubmitting}
          className="bg-red-600 text-white py-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}