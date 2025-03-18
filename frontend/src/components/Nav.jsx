import { TiThMenu } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { LuUserRound } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { RiHomeLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { SiGooglemaps } from "react-icons/si";
import "../styles/nav/nav.css";

const Nav = ({ categories, selectedCategory, setSelectedCategory }) => {
  const navigate = useNavigate();

  return (
    <div className="nav-wrapper">
      {/* Sección superior: menú y buscador */}
      <div className="nav-top">
        <div className="menu">
          <p className="d-inline-flex gap-1">
            <button
              className="btn btn-primary"
              data-bs-toggle="collapse"
              data-bs-target="#multiCollapseExample1"
              aria-expanded="false"
              aria-controls="multiCollapseExample1"
              aria-label="Abrir menú"
            >
              <TiThMenu />
            </button>
          </p>
          <div className="collapse multi-collapse" id="multiCollapseExample1">
            <div className="titleCategory">
            <h4>Categorías</h4>
            </div>
            <div className="card card-body">
              <ul className="category-list">
              <li
                key="general"
                className={`category-item ${selectedCategory === "" ? "active" : ""}`}
                onClick={() => setSelectedCategory("")}
              >
                General
              </li>
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  className={`category-item ${
                    selectedCategory === cat.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.nombre}
                </li>
              ))}
            </ul>
            </div>
          </div>
        </div>
        <div className="search">
          <form className="d-flex" role="search">
            <p className="d-inline-flex gap-1">
              <a
                className="btn btn-primary"
                data-bs-toggle="collapse"
                href="#multiCollapseExample2"
                role="button"
                aria-expanded="false"
                aria-controls="multiCollapseExample2"
                aria-label="Abrir menú de búsqueda"
              >
                <IoSearch />
              </a>
            </p>
            <div className="col search collapse" id="multiCollapseExample2">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
            </div>
          </form>
        </div>

      </div>

      {/* Sección inferior (fija) */}
      <div className="nav-bottom">
        <div className="nav-bottom-left">
          <div className="favorites">
            <button
              onClick={() => navigate("/favorites")}
              className="btn btn-primary"
              aria-label="Abrir la sección de favoritos"
            >
              <FaRegHeart />
            </button>
          </div>
          <div className="user">
            <button
              onClick={() => navigate("/user")}
              className="btn btn-primary"
              aria-label="Abrir la sección del usuario"
            >
              <LuUserRound />
            </button>
          </div>
        </div>
        <div className="nav-bottom-right">
          <div className="home">
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-primary"
              aria-label="Abrir la sección principal"
            >
              <RiHomeLine />
            </button>
          </div>
          <div className="maps">
            <button
              onClick={() => navigate("/Map")}
              className="btn btn-primary"
              aria-label="Abrir el mapa"
            >
              <SiGooglemaps />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
