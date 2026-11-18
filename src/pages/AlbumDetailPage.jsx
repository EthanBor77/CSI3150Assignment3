import { Link, useParams } from "react-router-dom";

function AlbumDetailPage({ albums }) {
  const { albumId } = useParams();
  const album = albums.find((a) => a.id === albumId);

  return (
    <section>
      <Link to="/">&larr; Back to Catalog</Link>
      {album ? (
        <h1>
          {album.title} <small>by {album.artist}</small>
        </h1>
      ) : (
        <h1>Album not found</h1>
      )}
    </section>
  );
}

export default AlbumDetailPage;
