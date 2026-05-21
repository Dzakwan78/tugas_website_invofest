export default function Biodata() {
  return (
    <div className="min-h-screen bg-[#dec5c5] p-6">

      {/* HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient from-[#7B1D3F] to-[#a10e44] p-8 md:p-10 text-red shadow-lg mb-8">

        {/* ORNAMEN */}
        <div className="absolute top-0 right-0 w-52 h-52 bg-blue-900/10 rounded-full -translate-y-16 translate-x-16"></div>

        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-900/10 rounded-full translate-y-16 -translate-x-10"></div>

        <p className="uppercase tracking-[4px] text-xs font-semibold text-red-900 relative z-10">
          Universitas Harkat Negeri
        </p>

        <h1 className="text-4xl md:text-5xl font-black mt-3 relative z-10">
          Biodata Mahasiswa
        </h1>

        <p className="mt-3 text-red-900 text-sm md:text-base relative z-10">
          Sistem Informasi Mahasiswa InvoFest
        </p>
      </div>

      {/* CONTENT */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* PROFILE CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 h-fit">

          {/* FOTO */}
          <div className="flex justify-center">
            <div className="relative">

              <div className="absolute inset-0 bg-[#7B1D3F] rounded-2xl rotate-6"></div>

              <img
              src="/Dzakwan.jpeg"
              alt="profile"
              className="relative w-56 h-72 object-cover rounded-2xl border-4 border-white shadow-lg"
            />
            </div>
          </div>

          {/* INFO */}
          <div className="text-center mt-8">

            <h2 className="text-2xl font-black text-[#1a0a10] uppercase leading-tight">
              Eka Dzakwan Venarindra
            </h2>

            <p className="text-gray-400 mt-2 font-medium">
              24090009
            </p>

            <div className="mt-6 flex flex-col gap-3">

              <div className="bg-[#7B1D3F] text-white py-3 rounded-xl font-semibold">
                Mahasiswa Aktif
              </div>

              <div className="bg-rose-50 text-[#7B1D3F] py-3 rounded-xl font-semibold border border-rose-100">
                Kelas 4A
              </div>

            </div>
          </div>
        </div>

        {/* DETAIL BIODATA */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-5">

          <InfoCard
            title="Nama Lengkap"
            value="Eka Dzakwan Venarindra"
          />

          <InfoCard
            title="NIM"
            value="24090009"
          />

          <InfoCard
            title="Kelas"
            value="4A"
          />

          <InfoCard
            title="Program Studi"
            value="Sarjana Terapan Teknik Informatika"
          />

          <InfoCard
            title="Fakultas"
            value="Sekolah Vokasi"
          />

          <InfoCard
            title="Alamat"
            value="Desa Pesantunan, RT02/02, Kecamatan Wanasari, Kabupaten Brebes, Jawa Tengah"
          />

        </div>

      </div>
    </div>
  );
}

type InfoProps = {
  title: string;
  value: string;
};

function InfoCard({ title, value }: InfoProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">

      <p className="text-xs uppercase tracking-[3px] text-gray-400 font-semibold">
        {title}
      </p>

      <h2 className="mt-3 text-xl font-bold text-[#1a0a10] leading-relaxed">
        {value}
      </h2>

      <div className="mt-5 h-1 w-14 bg-[#7B1D3F] rounded-full"></div>
    </div>
  );
}