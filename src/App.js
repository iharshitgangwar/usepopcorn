import { useEffect, useRef, useState } from 'react';
import StarRating from './components/starRating';
import LogoutOnBrowserClose from './components/closeWindow';
import { useMovies } from './components/useMovie';
import { useLocalStorage } from './components/useLocalStorage';
import { useKey } from './components/useKey';



function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function NumResult({ movies }) {
  return (
    <>

      {
        movies ?
          <p className="num-results">
            Found <strong> {movies?.length}</strong> results
          </p >
          : <p className="num-results">
            Movies Not Found
          </p >
      }</>

  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl?.current.focus();
    setQuery('')
  })
  return (
    <input
      ref={inputEl}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

const average = (arr) =>
  arr?.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? '–' : '+'}
      </button>

      {isOpen && children}
    </div>
  );
}

function MovieList({ movies, setSelectedId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie
          setSelectedId={setSelectedId}
          movie={movie}
          key={movie.imdbID}

        />
      ))}
    </ul>
  );
}

function Movie({ movie, setSelectedId }) {
  return (
    <li onClick={() => setSelectedId(movie.imdbID)}>
      <img
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>

    </li>
  );
}

function WatchedSummary({ watched }) {
  if (!watched) return;
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoviesList({ watched, handleWatcheddelete }) {
  // console.log(watched)
  return (
    <ul className="list">
      {watched?.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          handleWatcheddelete={handleWatcheddelete}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, handleWatcheddelete }) {
  return (
    <li>
      <img
        src={movie.poster}
        alt={`${movie.title} poster`}
      />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className='btn-delete' onClick={() => handleWatcheddelete(movie.imdbID)}>x</button>
      </div>

    </li>
  );
}
const KEY = '1e735c34'
function SelectedMovie({ watched, selectedId, handleBack, handleWatched }) {
  const [movie, setMovie] = useState({})
  const [userRating, setUserRating] = useState();
  const [added, setAdded] = useState(false);
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  const setSelectedData = async () => {
    try {
      const responce = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`);
      const data = await responce.json();
      setMovie(data)
    }
    catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    setSelectedData()
  }, [selectedId])
  const addMovieToList = () => {
    const newMovie =
      { imdbID: selectedId, title, poster, year, imdbRating: Number(imdbRating), runtime: Number(runtime?.split(" ").at(0)), userRating }
    handleWatched(newMovie)
  }
  useEffect(() => {
    document.title = title;
    return function () {
      document.title = "default"
    }
  }, [title])
  return (
    <div className="details">
      <>
        <header> <button className="btn-back" onClick={() => handleBack()}>&larr;</button>
          <img src={poster} alt={`Poster of ${movie} movie`} />
          <div className='details-overview'>
            <h2>{title}</h2>
            <p>{released} &bull; {runtime}</p>
            <p>{genre}</p>
            <p><span></span>{imdbRating} IMDb rating</p>
          </div>
        </header>

        <section>
          {watched.some(el => el.imdbID === selectedId) ?
            <div className='rating'>Already Added In List</div> : <div className='rating'> <StarRating
              size={24}
              className=""
              onSetStars={setUserRating}
              maxrating={10}
            />
              {userRating > 0 &&
                <button className="btn-add" onClick={() => addMovieToList(movie)}>+ Add to list</button>}
            </div>}
          <p><em>{plot}</em></p>
          <p>Starring {actors}</p>
          <p>Directod by {director}</p>
        </section>
      </>
    </div>)

}
export default function App() {
  const [query, setQuery] = useState('inception');
  const [watched, setWatched] = useLocalStorage([], 'watched')

  const { movies } = useMovies(query, handleBack)

  const [selectedId, setSelectedId] = useState()
  useKey("Escape", handleBack)
  function handleBack() {
    setSelectedId('')
  }

  const handleWatched = (movie) => {
    setWatched(watched => [...watched, movie])
    handleBack()
  }
  const handleWatcheddelete = (id) => {
    setWatched(watched => watched.filter(el => el.imdbID !== id))
  }



  return (
    <>
      <LogoutOnBrowserClose />
      <Navbar>
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          <MovieList movies={movies} setSelectedId={setSelectedId}></MovieList>
        </Box>
        <Box>
          <>
            {selectedId && <SelectedMovie selectedId={selectedId} handleBack={handleBack} watched={watched} handleWatched={handleWatched} />}

            <WatchedSummary watched={watched}> </WatchedSummary>
            <WatchedMoviesList watched={watched} handleWatcheddelete={handleWatcheddelete} />
          </>
        </Box>
      </Main>
    </>
  );
}
