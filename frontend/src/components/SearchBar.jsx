// components/SearchBar.jsx
import React, { useRef, useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useTranslation } from "react-i18next";

const SearchBar = ({ onSearch, alwaysActive = false }) => {
  const { t } = useTranslation();
  const searchRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce: cada vez que cambia el input, se llama a onSearch después de 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  // Si alwaysActive es true, no se utilizará el toggle
  const toggleSearch = (e) => {
    if (alwaysActive) return;
    e.stopPropagation();
    searchRef.current.classList.toggle("active");
    if (!searchRef.current.classList.contains("active")) {
      setSearchTerm("");
      onSearch("");
    }
  };

  const handleClickOutside = (e) => {
    if (alwaysActive) return;
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      if (searchRef.current.classList.contains("active")) {
        searchRef.current.classList.remove("active");
        setSearchTerm("");
        onSearch("");
      }
    }
  };

  useEffect(() => {
    if (!alwaysActive) {
      document.addEventListener("click", handleClickOutside, true);
      return () => {
        document.removeEventListener("click", handleClickOutside, true);
      };
    }
  }, [alwaysActive]);

  return (
    // Si alwaysActive es true, agregamos la clase "active" desde el inicio
    <div className={`search ${alwaysActive ? "active" : ""}`} ref={searchRef}>
      {/* Renderizamos el botón solo si no estamos en modo alwaysActive */}
      {!alwaysActive && (
        <button
          type="button"
          className="buttonSearch btn btn-primary search-icon"
          onClick={toggleSearch}
          aria-label={t("search.open")}
        >
          <IoSearch />
        </button>
      )}
      <input
        type="search"
        className="form-control search-input"
        placeholder={t("search.placeholder")}
        aria-label={t("search.input")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
