import React from "react";
import { Link } from "react-router-dom";
import Cancel from "../Components/cancel.png";
import Expand from "../Components/expand.png";

const Header = ({
  handleHeaderLinkClick,
  searchInput,
  setSearchInput,
  handleChange,
  handleSubmit,
  headerResponse,
  handleResponse,
}) => {
  return (
    <header className="headerContainer">
      <img src="logo" alt="logo" />
      <section className="headerLink" onClick={handleHeaderLinkClick}>
        <img
          className="headerResponseActions"
          src={headerResponse ? Cancel : Expand}
          alt=""
          onClick={() => handleResponse()}
        />
        <Link to="/" className="newsLink">
          News
        </Link>
        <Link to="news/weather" className="weatherLink">
          Weather
        </Link>

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            className="input"
            value={searchInput}
            onChange={handleChange}
          />
          <button onClick={handleSubmit}>Search</button>
        </form>
      </section>
    </header>
  );
};

export default Header;
