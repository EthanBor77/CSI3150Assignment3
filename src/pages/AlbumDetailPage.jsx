import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function AlbumDetailPage({ albums, onAddToCart }) {
  const { albumId } = useParams();
  const [qty, setQty] = useState(1);

  const album = albums.find((a) => a.id === albumId);

  if (!album) {
    return (
      <div className="detail-error">
        <h2>Album Not Found</h2>
        <Link className="btn btn-secondary" to="/">
          Return To Main Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="detail-container">
      <nav className="breadcrumb">
        <Link to="/">Catalog</Link> &gt; <span>{album.title}</span>
      </nav>

      <div className="detail-grid">
        <img src={album.image} alt={album.title} className="detail-img" />

        <div className="detail-info">
          <span className="album-genre">{album.genre}</span>
          <h1 className="detail-title">{album.title}</h1>
          <p className="detail-artist">{album.artist}</p>
          <p className="detail-price">${album.price.toFixed(2)}</p>
          <p className="detail-desc">{album.description}</p>

          <div className="stock-tag">
            {album.stock > 0
              ? `In Stock (${album.stock} units available)`
              : "Out of Stock"}
          </div>

          <table className="specs-table">
            <tbody>
              <tr>
                <th>Label</th>
                <td>{album.specs.label}</td>
              </tr>
              <tr>
                <th>Catalog Number</th>
                <td>{album.specs.catalogNumber}</td>
              </tr>
              <tr>
                <th>Pressing Weight</th>
                <td>{album.specs.weight}</td>
              </tr>
              <tr>
                <th>Speed</th>
                <td>{album.specs.speed}</td>
              </tr>
            </tbody>
          </table>

          <div className="detail-actions">
            <div className="qty-input-group">
              <label htmlFor="detail-qty">Quantity: </label>
              <input
                type="number"
                id="detail-qty"
                min="1"
                max={album.stock}
                value={qty}
                onChange={(e) =>
                  setQty(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              disabled={album.stock === 0}
              onClick={() => onAddToCart(album, qty)}
            >
              Add {qty} to cart
            </button>
          </div>

          <h3>Tracklist</h3>
          <ol className="tracklist">
            {album.tracklist.map((track) => (
              <li key={track}>{track}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default AlbumDetailPage;
