import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/SearchBarStyles.css";

function SearchBar({ movies, placeholder }) {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState(""); // Initialize with an empty string
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [notFound, setNotFound] = useState(false);

    // Log the movies to the console
    console.log(movies);

    const handleChange = (event) => {
        setNotFound(false);
        const wordEntered = event.target.value.trim();
        setInputValue(wordEntered);
        
        const newFilter = movies.filter((value) => {
            return value.toLowerCase().includes(wordEntered.toLowerCase());
        });

        setFilteredMovies(newFilter.length > 0 ? newFilter : []);
    };

    const buttonSubmit = () => {
        let flag = false;

        for (let movie of movies) {
            if (inputValue.toLowerCase() === movie.toLowerCase()) {
                flag = true;
                break;
            }
        }
        if (flag) {
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
                        value={inputValue} // Set value to inputValue
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
                            key={movie} // Add a unique key for each item
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
