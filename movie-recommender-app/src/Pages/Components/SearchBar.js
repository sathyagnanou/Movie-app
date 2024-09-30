import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/SearchBarStyles.css";

function SearchBar({ movies, placeholder }) {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [notFound, setNotFound] = useState(false);

    // Log the movies to the console
    console.log(movies);

    const searchMoviesFromTMDb = async (query) => {
        const apiKey = 'c0fd9fb190ecde9fe0707e140057cb0f'; // Replace with your actual TMDb API Key
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`);
        const data = await response.json();
        return data.results.map(movie => movie.title); // Extract only movie titles
    };

    const handleChange = async (event) => {
        setNotFound(false);
        const wordEntered = event.target.value.trim();
        setInputValue(wordEntered);
        
        const localFilter = movies.filter((value) => {
            return value.toLowerCase().includes(wordEntered.toLowerCase());
        });

        if (localFilter.length > 0) {
            setFilteredMovies(localFilter);
        } else if (wordEntered.length > 0) {
            // If not found locally, search in TMDb
            const tmdbMovies = await searchMoviesFromTMDb(wordEntered);
            setFilteredMovies(tmdbMovies.length > 0 ? tmdbMovies : []);
        } else {
            setFilteredMovies([]);
        }
    };

    const buttonSubmit = async () => {
        let found = movies.some(movie => movie.toLowerCase() === inputValue.toLowerCase());

        if (!found) {
            // Check from TMDb if the movie is found
            const tmdbMovies = await searchMoviesFromTMDb(inputValue);
            found = tmdbMovies.some(movie => movie.toLowerCase() === inputValue.toLowerCase());
        }

        if (found) {
            navigate(`/search/${inputValue}`);
        } else {
            setNotFound(true);
        }
    };

    return (
        <div className="SearchBody">
            <div className="CompleteBar">
                <div className="BAR">
                    <input
                        placeholder={placeholder}
                        className="searchingbar"
                        type="text"
                        title="Search"
                        value={inputValue}
                        onChange={handleChange}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                buttonSubmit();
                            }
                        }}
                    />
                    <button className="search-button" onClick={buttonSubmit}>
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
            {notFound ? (
                <div className="NotFound">
                    Sorry! The Movie You Searched for is not present in our database
                </div>
            ) : null}
            {filteredMovies.length > 0 ? (
                <div className="searchList">
                    {filteredMovies.slice(0, 10).map((movie) => (
                        <div
                            className="searchItem"
                            key={movie}
                            onClick={() => navigate(`/search/${movie}`)}
                        >
                            {movie}
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export default SearchBar;
