// components/SearchBar.jsx
import React, { useRef, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";

const SearchBar = ({ onSearch }) => {
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce: cada vez que cambia el input, se llama a onSearch después de 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const toggleSearch = (e) => {
    e.stopPropagation();
    // Alterna la clase "active"
    searchRef.current.classList.toggle("active");
    // Si se cierra la barra, limpiar el input
    if (!searchRef.current.classList.contains("active")) {
      setSearchTerm("");
      onSearch("");
    }
  };

  const handleClickOutside = (e) => {
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      if (searchRef.current.classList.contains("active")) {
        searchRef.current.classList.remove("active");
        setSearchTerm("");
        onSearch("");
      }
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () =>
      document.removeEventListener("click", handleClickOutside, true);
  }, []);

  return (
    <div className="search" ref={searchRef}>
      <button
        type="button"
        className="buttonSearch btn btn-primary search-icon"
        onClick={toggleSearch}
        aria-label="Abrir búsqueda"
      >
        <IoSearch />
      </button>
      <input
        type="search"
        className="form-control search-input"
        placeholder="Buscar..."
        aria-label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
