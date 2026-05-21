import { useEffect, useState } from "react";

// ===== ENDPOINTS =====
// PERBAIKAN: Dialihkan dari localhost ke URL Vercel Backend yang sudah live
const EVENTS_URL = "https://backend-invofest-taupe.vercel.app/events";
const CATEGORIES_URL = "https://backend-invofest-taupe.vercel.app/categories";
const PEMBICARA_URL = "https://backend-invofest-taupe.vercel.app/pembicara";

// ===== TYPES =====
type Stat = {
  title: string;
  value: number;
  icon: string;
};

type EventItem = {
  id: number;
  name: string;
  dateEvent: string;
  category?: { nama: string };
};

type SpeakerItem = {
  id: number;
  name: string;
  role: string; // Sesuaikan dengan skema database 'role'
};

// ===== COMPONENTS =====
function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-400 uppercase">
          {stat.title}
        </span>
        <span className="text-2xl">{stat.icon}</span>
      </div>

      <p className="text-4xl font-bold text-[#1a0a10]">
        {stat.value}
      </p>

      <div className="h-1 w-10 bg-[#7B1D3F] rounded-full" />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="w-4 h-0.5 bg-[#7B1D3F]" />
      <h2 className="text-sm font-bold text-[#1a0a10]">{title}</h2>
    </div>
  );
}

function EventListItem({ item, isLast }: { item: EventItem; isLast: boolean }) {
  return (
    <li className={`flex items-center justify-between py-4 ${isLast ? "" : "border-b border-gray-100"}`}>
      <div>
        <p className="font-semibold text-[#1a0a10]">{item.name}</p>
        <p className="text-sm text-gray-400">
          {new Date(item.dateEvent).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <span className="text-sm bg-rose-100 text-[#7B1D3F] px-3 py-1 rounded-full font-medium">
        {item.category?.nama || "Umum"}
      </span>
    </li>
  );
}

function SpeakerListItem({ item, index, isLast }: { item: SpeakerItem; index: number; isLast: boolean }) {
  const initials = item.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const colors = [
    "from-[#7B1D3F] to-[#c9395e]",
    "from-[#1a4f7B] to-[#3982c9]",
    "from-[#1a7B3F] to-[#39c970]",
  ];

  return (
    <li className={`flex items-center gap-4 py-4 ${isLast ? "" : "border-b border-gray-100"}`}>
      <div
        className={`w-10 h-10 rounded-full bg-linear-to-r ${
          colors[index % colors.length]
        } text-white text-sm font-bold flex items-center justify-center`}
      >
        {initials}
      </div>

      <div>
        <p className="font-semibold text-[#1a0a10]">{item.name}</p>
        <p className="text-sm text-gray-400">{item.role}</p> {/* Menggunakan role */}
      </div>
    </li>
  );
}

// ===== MAIN DASHBOARD =====

export default function Dashboard() {
  const [stats, setStats] = useState<Stat[]>([
    { title: "Kategori", value: 0, icon: "🗂️" },
    { title: "Event", value: 0, icon: "📅" },
    { title: "Pembicara", value: 0, icon: "🎤" },
    { title: "Total Data", value: 0, icon: "📊" }, // Pengganti Event Aktif agar lebih relevan dengan tabel kamu
  ]);

  const [latestEvents, setLatestEvents] = useState<EventItem[]>([]);
  const [latestSpeakers, setLatestSpeakers] = useState<SpeakerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Ambil ketiga data dari backend secara paralel
        const [resEvents, resCategories, resSpeakers] = await Promise.all([
          fetch(EVENTS_URL),
          fetch(CATEGORIES_URL),
          fetch(PEMBICARA_URL),
          
        ]);

        const eventsData: EventItem[] = await resEvents.json();
        const categoriesData = await resCategories.json();
        const speakersData: SpeakerItem[] = await resSpeakers.json();

        // 1. Set Counter Box Statistik berdasarkan panjang array (.length) data asli
        setStats([
          { title: "Kategori", value: categoriesData.length, icon: "🗂️" },
          { title: "Event", value: eventsData.length, icon: "📅" },
          { title: "Pembicara", value: speakersData.length, icon: "🎤" },
          { title: "Total Modul", value: categoriesData.length + eventsData.length + speakersData.length, icon: "📊" },
        ]);

        // 2. Ambil maksimal 3 data terbaru saja untuk ditaruh di list bawah
        setLatestEvents(eventsData.slice(0, 3));
        setLatestSpeakers(speakersData.slice(0, 3));

      } catch (error) {
        console.error("Gagal memuat statistik dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-gray-400 text-sm">Memuat ringkasan dashboard...</div>;
  }

  return (
    <div className="px-10 py-10 w-full space-y-10">

      {/* HEADER */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-5 h-0.5 bg-[#7B1D3F]" />
          <span className="text-xs font-semibold text-[#7B1D3F] uppercase tracking-widest">
            Overview
          </span>
        </div>

        <h1 className="text-3xl font-bold text-[#1a0a10]">Dashboard</h1>
        <p className="text-gray-400 mt-2">Ringkasan data Invofest hari ini secara real-time</p>
      </div>

      {/* STATS COUNTER BOX */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} stat={stat} />
        ))}
      </div>

      {/* BOTTOM CONTENT LIST */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* LATEST EVENTS COLUMN */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <SectionHeader title="Event Terbaru" />
          {latestEvents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Belum ada data event</p>
          ) : (
            <ul>
              {latestEvents.map((item, i) => (
                <EventListItem
                  key={item.id}
                  item={item}
                  isLast={i === latestEvents.length - 1}
                />
              ))}
            </ul>
          )}
        </div>

        {/* LATEST SPEAKERS COLUMN */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <SectionHeader title="Pembicara Terbaru" />
          {latestSpeakers.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Belum ada data pembicara</p>
          ) : (
            <ul>
              {latestSpeakers.map((item, i) => (
                <SpeakerListItem
                  key={item.id}
                  item={item}
                  index={i}
                  isLast={i === latestSpeakers.length - 1}
                />
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}