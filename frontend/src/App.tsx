import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import News from "./pages/News";
import Gallery from "./pages/Gallery";
import Livestream from "./pages/Livestream";
import Investments from "./pages/Investments";
import Ministries from "./pages/Ministries";
import MinistryDetailPage from "./pages/MinistryDetail";
import NoticeDetailPage from "./pages/NoticeDetail";
import ProjectDetailPage from "./pages/ProjectDetail";
import SearchPage from "./pages/Search";
import Contact from "./pages/Contact";

export default function App(): JSX.Element {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/livestream" element={<Livestream />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/ministries/:slug" element={<MinistryDetailPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/notices/:id" element={<NoticeDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/administration" element={<Navigate to="/ministries" replace />} />
          <Route path="/complaints" element={<Navigate to="/ministries" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
