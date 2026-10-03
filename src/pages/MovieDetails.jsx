import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function MovieDetails() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getMovie() {
      try {
        const url =
          `https://www.omdbapi.com/?apikey=${API_KEY}` +
          `&i=${id}&plot=full`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError(data.Error || "Movie not found");
        }
      } catch {
        setError("Unable to connect to OMDb");
      }

      setLoading(false);
    }

    getMovie();
  }, [id]);

  if (loading) {
    return (
      <div className="page-center">
        <div className="spinner"></div>
        <p>Loading movie...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <h2>⚠️ {error}</h2>
        <Link to="/" className="back">
          ← Back Home
        </Link>
      </div>
    );
  }

  const poster =
    movie.Poster !== "N/A"
      ? movie.Poster
      : "https://via.placeholder.com/400x600?text=No+Poster";

  return (
    <div className="details-page">

      <nav className="navbar">
        <Link to="/" className="logo">
          🎬 Movie<span>Explorer</span>
        </Link>
      </nav>

      <main className="details-container">

        <Link to="/" className="back">
          ← Back to Movies
        </Link>

        <div className="details-card">

          <img
            src={poster}
            alt={movie.Title}
            className="details-poster"
          />

          <div className="details-content">

            <span className="badge">
              {movie.Type}
            </span>

            <h1>{movie.Title}</h1>

            <div className="rating">
              ⭐ {movie.imdbRating} / 10
            </div>

            <div className="movie-data">
              <span>📅 {movie.Year}</span>
              <span>⏱️ {movie.Runtime}</span>
              <span>🎭 {movie.Genre}</span>
            </div>

            <hr />

            <h2>Overview</h2>

            <p className="plot">
              {movie.Plot}
            </p>

            <div className="extra">
              <p>
                <b>Director:</b> {movie.Director}
              </p>

              <p>
                <b>Actors:</b> {movie.Actors}
              </p>

              <p>
                <b>Language:</b> {movie.Language}
              </p>

              <p>
                <b>Country:</b> {movie.Country}
              </p>

              <p>
                <b>Released:</b> {movie.Released}
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default MovieDetails;