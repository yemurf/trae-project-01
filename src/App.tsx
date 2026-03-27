import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/AppShell";
import Home from "@/pages/Home";
import EntryNew from "@/pages/EntryNew";
import EntryDetail from "@/pages/EntryDetail";
import EntryEdit from "@/pages/EntryEdit";
import History from "@/pages/History";
import Trends from "@/pages/Trends";

export default function App() {
  return (
    <Router>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entries/new" element={<EntryNew />} />
          <Route path="/entries/:id" element={<EntryDetail />} />
          <Route path="/entries/:id/edit" element={<EntryEdit />} />
          <Route path="/history" element={<History />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/other" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </Router>
  );
}
