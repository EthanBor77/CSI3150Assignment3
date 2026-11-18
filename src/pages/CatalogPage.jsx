import { Link } from "react-router-dom";

function CatalogPage({ albums }) {
  return (
    <section>
      <h1>Catalog</h1>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>
            <Link to={`/album/${album.id}`}>{album.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default CatalogPage;
