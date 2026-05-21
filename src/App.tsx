import { Routes, Route } from "react-router-dom";

// LAYOUT
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// PAGES
import Beranda from "./pages/Beranda";
import Competition from "./pages/Competition";
import Seminar from "./pages/Seminar";
import Workshop from "./pages/Workshop";
import Talkshow from "./pages/Talkshow";
import Login from "./pages/Login";
import Register from "./pages/Register";

// DASHBOARD PAGES
import Dashboard from "./pages/dashboard/Dashboard";
import CategoryIndex from "./pages/dashboard/kategori/CategoryIndex";
import CategoryCreate from "./pages/dashboard/kategori/CategoryCreate";
import CategoryEdit from "./pages/dashboard/kategori/CategoryEdit"; // ← 1. IMPORT FILE EDIT KATEGORI DI SINI
import PembicaraIndex from "./pages/dashboard/pembicara/PembicaraIndex";
import PembicaraCreate from "./pages/dashboard/pembicara/PembicaraCreate";
import EventIndex from "./pages/event/EventIndex";
import EventCreate from "./pages/event/EventCreate";
import PembicaraEdit from "./pages/dashboard/pembicara/PembicaraEdit";
import Biodata from "./pages/dashboard/biodata/Biodata";

// ROUTE PROTECT
import ProtectedRoute from "./route/ProtectedRoute";
import EventEdit from "./pages/event/EventEdit";

function App() {
  return (
    <Routes>

      {/* 🌐 HALAMAN UTAMA (PAKAI HEADER) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/competition" element={<Competition />} />
        <Route path="/seminar" element={<Seminar />} />
        <Route path="/workshop" element={<Workshop />} />
        <Route path="/talkshow" element={<Talkshow />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* 🔐 PROTECTED ROUTE */}
      <Route element={<ProtectedRoute />}>
        
        {/* 📊 DASHBOARD (TANPA HEADER ATAS) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          
          {/* MODUL KATEGORI */}
          <Route path="kategori" element={<CategoryIndex />} />
          <Route path="kategori/create" element={<CategoryCreate />} />
          <Route path="kategori/edit/:id" element={<CategoryEdit />} /> {/* ← 2. DAFTARKAN RUTE EDIT DI SINI */}
          
          {/* MODUL PEMBICARA */}
          <Route path="pembicara" element={<PembicaraIndex />} />
          <Route path="pembicara/create" element={<PembicaraCreate />} />
          <Route path="pembicara/edit/:id" element={<PembicaraEdit />} />
          
          {/* MODUL EVENT */}
          <Route path="event" element={<EventIndex />} />
          <Route path="event/create" element={<EventCreate />} />
          <Route path="event/edit/:id" element={<EventEdit />} />
          
          {/* MODUL BIODATA */}
          <Route path="biodata" element={<Biodata />} />
        </Route>

      </Route>

    </Routes>
  );
}

export default App;