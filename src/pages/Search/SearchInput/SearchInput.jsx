import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import './SearchInput.scss';

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (search) {
            navigate(`/search?q=${search}`);
            setSearch("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="search-input">
                <button type="submit">
                    <IoIosSearch size={20} />
                </button>
                <input
                    type="text"
                    placeholder="Pesquisar"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </form>
    );
};

export default SearchInput;
