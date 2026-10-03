import { useState } from "react";
import { Link } from "react-router-dom";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function Home() {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);
  const [error, setError] = useState("");

  async function searchMovies() {
    if (!search.trim()) {
      setError("Enter a movie name");
      return;
    }

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      let url =
        `https://www.omdbapi.com/?apikey=${API_KEY}` +
        `&s=${encodeURIComponent(search.trim())}`;

      if (type) {
        url += `&type=${type}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search || []);
      } else {
        setError(data.Error || "No movies found");
      }
    } catch {
      setError("Unable to connect to OMDb");
    }

    setLoading(false);
  }

  return (
    <div className={dark ? "app dark" : "app"}>

      <nav className="navbar">
        <Link to="/" className="logo">
          🎬 Movie<span>Explorer</span>
        </Link>

        <button
          className="theme"
          onClick={() => setDark(!dark)}
        >
          {dark ? "☀️" : "🌙"}
        </button>
      </nav>

      <section className="hero">
        <div className="hero-content">

          <div className="badge">
            🎬 MOVIE EXPLORER
          </div>

          <h1>
            Find Your
            <br />
            <span>Favorite Movies</span>
          </h1>

          <p>
            Search movies, explore ratings and discover
            movie details.
          </p>

          <div className="search-box">
            <input
              value={search}
              placeholder="Search for a movie..."
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchMovies();
                }
              }}
            />

            <button onClick={searchMovies}>
              🔍 Search
            </button>
          </div>

          <div className="filters">

            <button
              className={type === "" ? "active" : ""}
              onClick={() => setType("")}
            >
              All
            </button>

            <button
              className={type === "movie" ? "active" : ""}
              onClick={() => setType("movie")}
            >
              🎬 Movies
            </button>

            <button
              className={type === "series" ? "active" : ""}
              onClick={() => setType("series")}
            >
              📺 Series
            </button>

          </div>

        </div>
      </section>

      <main className="content">

        <div className="heading">
          <h2>
            {movies.length ? "Search Results" : "Explore Movies"}
          </h2>

          <p>
            {movies.length
              ? `${movies.length} results found`
              : "Search above to discover movies"}
          </p>
        </div>

        {loading && (
          <div className="message">
            <div className="spinner"></div>
            <h3>Searching movies...</h3>
          </div>
        )}

        {error && !loading && (
          <div className="message">
            <div className="big-icon">⚠️</div>
            <h3>{error}</h3>
            <p>Try searching Titanic, Avatar or Batman.</p>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="message">
            <div className="big-icon">🎥</div>
            <h2>Start Exploring</h2>
            <p>Search for your favorite movie above.</p>
          </div>
        )}

        <div className="movie-grid">

          {movies.map((movie) => {

            const poster =
              movie.Poster !== "N/A"
                ? movie.Poster
                : "https://via.placeholder.com/300x450?text=No+Poster";

            return (
              <div className="movie-card" key={movie.imdbID}>

                <img
                  src={poster}
                  alt={movie.Title}
                />

                <div className="movie-info">

                  <span className="movie-type">
                    {movie.Type}
                  </span>

                  <h3>{movie.Title}</h3>

                  <p>📅 {movie.Year}</p>

                  <Link
                    to={`/movie/${movie.imdbID}`}
                    className="details-btn"
                  >
                    View Details →
                  </Link>

                </div>

              </div>
            );
          })}

        </div>

      </main>

      <footer>
        <b>🎬 Movie Explorer</b>
        <span>Powered by OMDb API</span>
      </footer>

    </div>
  );
}

export default Home;