import "./App.css";
import Header from "./Components/Header";
import News from "./Components/News";
import Weather from "./Components/Weather";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useState, useReducer, useRef, useEffect } from "react";

import ReactPaginate from "react-paginate";

function App() {
  const [newsData, setNewsData] = useState([]);
  const [weatherData, setweatherData] = useState([]);
  const [weatherCity, setWeatherCity] = useState("edmonton");
  const [defaultNews, setDefaultNews] = useState("top-headlines?");
  const [headerResponse, setHeaderResponse] = useState(false);

  const handleResponse = () => {
    setHeaderResponse(() => !headerResponse);
    if (headerResponse) {
      document.querySelector(".headerContainer").classList.remove("expand");
      document.querySelector(".weatherLink").classList.remove("align");
      document.querySelector(".newsLink").classList.remove("align");
      document.querySelector(".form").classList.remove("align");
    } else if (!headerResponse) {
      //////////
      document.querySelector(".weatherLink").classList.add("align");
      document.querySelector(".newsLink").classList.add("align");
      document.querySelector(".form").classList.add("align");
      document.querySelector(".headerContainer").classList.add("expand");
    }
  };

  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState({
    newsSearch: "",
    weatherSearch: "",
  });
  useEffect(() => {
    document.querySelector(".input").setAttribute("name", "newsSearch");
    navigate("/");
  }, []);
  useEffect(() => {
    const fetchNews = async () => {
      const api = await fetch(
        `https://gnews.io/api/v4/${defaultNews}token=fcb3d604f8dd7d68bdc2bd6e460d0f28&lang=en`
      );
      const parse = await api.json();
      if (parse) {
        console.log(parse);
        setNewsData(parse?.articles?.slice(0, 10));
      } else {
        console.log("still loading");
      }
    };

    fetchNews();
    // api key for Gnews fcb3d604f8dd7d68bdc2bd6e460d0f28
    // for headlines https://gnews.io/api/v4/top-headlines?token=fcb3d604f8dd7d68bdc2bd6e460d0f28&lang=en

    //to search https://gnews.io/api/v4/search?q=russia&token=fcb3d604f8dd7d68bdc2bd6e460d0f28&lang=en
    ////////////////////////////////////

    // fetching weather data

    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "1d07dcf1a7mshd340d7d196c25a9p12a4b4jsn24eff67cfc99",
        "X-RapidAPI-Host": "weatherapi-com.p.rapidapi.com",
      },
    };

    fetch(
      `https://weatherapi-com.p.rapidapi.com/current.json?q=${weatherCity}`,
      options
    )
      .then((response) => response.json())
      .then((response) => setweatherData(response))
      .catch((err) => console.error(err));
  }, [defaultNews, weatherCity]);

  //fetch the data for both news and weather
  //done
  //set the pagination
  //done
  //pagination for news starts here
  const [pageNumber, setPageNumber] = useState(0);
  const newsPerPage = 6;
  const pagesVisited = pageNumber * newsPerPage;
  const displayNews = newsData
    ? newsData
        .slice(pagesVisited, pagesVisited + newsPerPage)
        .map((article) => {
          return (
            <div className="newsArticle">
              <h3 className="title" key={new Date().getMilliseconds()}>
                {article.title}
              </h3>
              <img src={article.image} alt="" />
              <h2 className="description">{article.description}</h2>
              <p className="sourceLink">{article.source.name}</p>
              <p className="readMoreLink">
                read more-
                <a href={article.source.url} target="_blank">
                  {article.source.url}
                </a>
              </p>
            </div>
          );
        })
    : console.log("not working");

  const pageCount = Math.ceil(newsData?.length / newsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  ///pagination stops here

  //////////////

  //display the data for the news
  // fetchData();
  //mapping the weather data below
  let current, location;
  if (weatherData.length !== 0) {
    current = weatherData.current;
    location = weatherData.location;
  }
  //handling search inputs
  const [inputName, setInputName] = useState();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputName(name);
    console.log(inputName);
    setSearchInput(() => {
      return {
        [name]: value,
      };
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(searchInput);
    if (searchInput.weatherSearch) {
      setWeatherCity(searchInput.weatherSearch);
    }
    if (searchInput.newsSearch) {
      setDefaultNews(`search?q=${searchInput.newsSearch}&`);
    }
    setSearchInput(() => {
      return {
        newsSearch: "",
        weatherSearch: "",
      };
    });
  };
  const handleHeaderLinkClick = (e) => {
    console.log(e.target.className);

    const className = e.target.className;
    console.log(className.includes("newsLink"));
    if (className.includes("newsLink")) {
      document?.querySelector(".input").setAttribute("name", "newsSearch");
    }
    if (className.includes("weatherLink")) {
      document?.querySelector(".input").setAttribute("name", "weatherSearch");
    }
  };

  return (
    <div className="App">
      <Header
        handleHeaderLinkClick={handleHeaderLinkClick}
        searchInput={searchInput.newsSearch}
        setSearchInput={setSearchInput}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        headerResponse={headerResponse}
        handleResponse={handleResponse}
      />
      <Routes>
        <Route
          path="/"
          element={
            <News
              pageCount={pageCount}
              changePage={changePage}
              displayNews={displayNews}
            />
          }
        />
        <Route
          path="news/weather"
          element={
            <Weather
              weatherData={weatherData}
              location={location}
              current={current}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
