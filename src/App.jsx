import { Routes, Route } from "react-router-dom";
import { ALBUMS } from "./data/albums.js";
import Navbar from "./components/Navbar.jsx";
import CatalogPage from "./pages/CatalogPage.jsx";
import AlbumDetailPage from "./pages/AlbumDetailPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";

function App() {
  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<CatalogPage albums={ALBUMS} />} />
          <Route
            path="/album/:albumId"
            element={<AlbumDetailPage albums={ALBUMS} />}
          />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
