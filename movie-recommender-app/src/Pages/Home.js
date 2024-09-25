import SearchBar from "./Components/SearchBar";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import "./Components/styles/HomeStyles.css";
import MovieCard from "./Components/MovieCard";
import { useEffect, useState } from "react";

const Home = () => {
    const apiKey = "api_key=b97316ed479ee4226afefc88d1792909";
    const [list, setList] = useState([]);
    const [homeGenreList, setHomeGenreList] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [currMovies, setCurrMovies] = useState([]);

    useEffect(() => {
        setCurrMovies([]);
        setSelectedGenres([]);
        setHomeGenreList([]);
        setList([]);

        // Fetching the list of all movies from our Flask server for the search bar
        fetch("/api/movies")
            .then((Response) => Response.json())
            .then((data) => setList(data.arr))
            .catch((error) => console.error("Error fetching movies:", error));

        // Getting the list of all genres
        fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`)
            .then((Response) => Response.json())
            .then((data) => setHomeGenreList(data.genres))
            .catch((error) => console.error("Error fetching genres:", error));
    }, []);

    useEffect(() => {
        setCurrMovies([]);
        if (selectedGenres.length > 0) {
            fetch(
                `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&${apiKey}&release_date.lte=2019-12-12&with_genres=${encodeURI(
                    selectedGenres.join(",")
                )}`
            )
                .then((Response) => Response.json())
                .then((data) => setCurrMovies(data.results))
                .catch((error) => console.error("Error fetching current movies:", error));
        }
    }, [selectedGenres]);

    const onTagClick = (genreId) => {
        setSelectedGenres((prevGenres) =>
            prevGenres.includes(genreId)
                ? prevGenres.filter((item) => item !== genreId)
                : [...prevGenres, genreId]
        );
    };

    const renderMovies = () =>
        currMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
        ));

    return (
        <div className="container-fluid">
            <div className="HomePage">
                <NavBar isHome={false} />
                <div className="HomeSearch">
                    <SearchBar movies={list} placeholder="Search for a Movie" />
                </div>

                <h2 className="genreHeader">Get Top Movies Based On Genre</h2>
                <div className="buttonGrid">
                    {homeGenreList.map((genre) => (
                        <div
                            key={genre.id}
                            onClick={() => onTagClick(genre.id)}
                            className={
                                selectedGenres.includes(genre.id)
                                    ? "genreTagON"
                                    : "genreTagOFF"
                            }
                        >
                            {genre.name}
                            {selectedGenres.includes(genre.id) && (
                                <i className="fa fa-times" aria-hidden="true"></i>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="container-fluid HomeMovies">
                <div className="container HomeMovieGrid">
                    {currMovies.length > 0 ? renderMovies() : null}
                </div>
            </div>

            <div className="HomeFooter">
                <Footer />
            </div>
        </div>
    );
};

export default Home;
