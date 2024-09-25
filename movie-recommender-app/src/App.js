import "./App.css";
import Home from "./Pages/Home";
import SearchResult from "./Pages/SearchResult";
import Chatbot from "./Pages/Chatbot"; // Import Chatbot page
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search/:id" element={<SearchResult />} />
                    <Route path="/chatbot" element={<Chatbot />} /> {/* New Chatbot route */}
                </Routes>
            </Router>
        </div>
    );
}

export default App;
