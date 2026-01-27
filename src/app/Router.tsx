import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { LandingPage } from '../pages/Landing/LandingPage';
import { TemplatesPage } from '../pages/Templates/TemplatesPage';
import { DashboardPage } from '../pages/Dashboard/DashboardPage';
import { EditorPage } from '../pages/Editor/EditorPage';
import { ExportPage } from '../pages/Export/ExportPage';

export function Router() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/editor/:id" element={<EditorPage />} />
            <Route path="/export/:id" element={<ExportPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
