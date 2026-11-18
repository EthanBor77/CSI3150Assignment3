import { useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";

function CatalogPage({ albums, onAddToCart }) {
  const genres = ["All", "Jazz", "Electronic", "Rock", "Classical"];
  const [selectedGenre, setSelectedGenre] = useState("All");

  const validAlbums = albums || [];

  const filteredAlbums =
    selectedGenre === "All"
      ? validAlbums
      : validAlbums.filter((album) => album.genre === selectedGenre);

  return (
    <div className="catalog-container">
      <header className="catalog-hero">
        <h1>Independent Vinyl, Pressed With Care</h1>
        <p>
          Heavyweight pressings and collector editions across jazz, electronic,
          rock, and classical.
        </p>
      </header>

      <div className="filter-bar">
        {genres.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`filter-pill ${selectedGenre === genre ? "active" : ""}`}
            onClick={() => setSelectedGenre(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="album-grid">
        {filteredAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}

export default CatalogPage;
