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
import PembicaraIndex from "./pages/dashboard/pembicara/PembicaraIndex";
import PembicaraCreate from "./pages/dashboard/pembicara/PembicaraCreate";
import EventIndex from "./pages/event/EventIndex";
import EventCreate from "./pages/event/EventCreate";

// ROUTE PROTECT
import ProtectedRoute from "./route/ProtectedRoute";

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
          <Route path="kategori" element={<CategoryIndex />} />
          <Route path="kategori/create" element={<CategoryCreate />} />
          <Route path="pembicara" element={<PembicaraIndex />} />
          <Route path="pembicara/create" element={<PembicaraCreate />} />
          <Route path="/dashboard/event" element={<EventIndex />} />
          <Route path="/dashboard/event/create" element={<EventCreate />} />
        </Route>

      </Route>

    </Routes>
  );
}

export default App;