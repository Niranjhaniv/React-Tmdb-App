import {
  API_KEY,
  PATH_BASE,
  PATH_MOVIE,
  PATH_PAGE,
  PATH_SEARCH
} from "../../api/api";
import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import MovieThumb from "./../MovieTile/MovieThumb";
import "../../App.scss";
import theme from "../../modules/theme";
import styled from "styled-components";
import { utils, Input } from "styled-minimal";
import searchButton from "../../assets/media/search.png";
const { responsive } = utils;
const MoviesWrapper = styled.div`
  display: block;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  ${() =>
    responsive({
      xs: `
      max-width: 340px;
      `,
      ix: `
      max-width: 340px;
      padding: 0;
      `,
      md: `
      max-width: 525px;
      `,
      lg: `
      max-width: 1024px;
      `,
      xl: `
      `
    })};
`;
const InputCover = styled.div`
  position: relative;
  top: -22px;
  input {
    height: 44px;
    border-radius: 22px;
    padding: 0 40px 0 15px;
    &:focus {
      outline: none;
      box-shadow: 0px 0px 0px 2px ${theme.palette.primary};
    }
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  }
  button {
    width: 44px;
    height: 33px;
    border-radius: 22px;
    background: white;
    border: white;
    position: absolute;
    right: 0;
    top: 3px;
    &:focus {
      outline: none;
    }
    img:hover {
      cursor: pointer;
    }
  }
`;

class MovieComponents extends Component {
  constructor(props) {
    super(props);
    const { query } = this.props;
    const { page } = this.props;
    this.state = {
      movies: {},
      loading: true,
      query,
      page
    };
  }

  componentWillMount = () => {
    const { page } = this.state;
    if (!this.state.movies.length) {
      for (let i = 1; i <= page; i++) {
        this.getMovies(this.props.section, i);
      }
    }
  };

  componentDidMount = () => {
    const { query } = this.state;
    const { page } = this.state;
    if (!this.state.movies.length) {
      if (query) {
        for (let i = 1; i <= page; i++) {
          this.getMoviesSearch(query, i);
        }
      } else {
        for (let i = 1; i <= page; i++) {
          this.getMovies(this.props.section, i);
        }
      }
      // }
    }
  };

  handleInputChange = name => e => {
    this.setState({
      [name]: e.target.value
    });
  };

  handleFormSubmit = e => {
    e.preventDefault();
    const { query } = this.state;
    if (query === "") {
      this.getMovies("popular", 1);
    } else {
      this.getMoviesSearch(query, 1);
    }
  };

  getMoviesSearch = (query, page, includeAdult = false) => {
    fetch(
      `${PATH_BASE}${PATH_SEARCH}${PATH_MOVIE}?language=en-US&api_key=${API_KEY}&${PATH_PAGE}${page}&include_adult=${includeAdult}&query=${query}`
    )
      .then(response => response.json())
      .then(movies => this.setMovies(movies));
  };
  getMovies = (section, page) => {
    fetch(
      `${PATH_BASE}${PATH_MOVIE}/popular?language=en-US&api_key=${API_KEY}&${PATH_PAGE}${page}`
    )
      .then(response => response.json())
      .then(movies => this.setMovies(movies));
  };

  setMovies = movies => {
    const { results, page } = movies;

    const oldResults = page !== 1 ? this.state.movies.results : [];

    const updatedResults = [...oldResults, ...results];

    this.setState({
      movies: { results: updatedResults, page },
      loading: false
    });
  };

  render() {
    const { movies } = this.state;
    const { results, page } = movies;
    const { query } = this.state;

    return (
      <MoviesWrapper>
        <div className="popular-wrapper">
          <form onSubmit={this.handleFormSubmit}>
            <InputCover>
              <Input
                type="text"
                value={query}
                onChange={this.handleInputChange("query")}
                placeholder="Search"
              />
              <button type="submit">
                <img src={searchButton} alt="search" />
              </button>
            </InputCover>
          </form>
          <Container>
            <Row>
              <Col className="d-flex justify-content-between sectionTileRow">
                <h2>Popular Movies</h2>
              </Col>
            </Row>
            <Row>
              {results &&
                this.state.movies.results.map(movie => {
                  return (
                    <MovieThumb
                      key={movie.id}
                      id={movie.id}
                      name={movie.original_title}
                      voteRating={movie.vote_average}
                      date={movie.release_date}
                      query={query}
                      page={page}
                      baseUrl={this.props.baseUrl}
                      smPosterSize={this.props.smPosterSize}
                      posterPath={movie.poster_path}
                      goToPage={this.props.goToPage}
                    />
                  );
                })}
            </Row>
            <Row className="navigationRow">
              <Col>
                <button
                  className="primaryButton next-btn pointer"
                  onClick={() =>
                    query !== ""
                      ? this.getMoviesSearch(query, page + 1)
                      : this.getMovies("popular", page + 1)
                  }
                >
                  Load More
                </button>
              </Col>
            </Row>
          </Container>
        </div>
      </MoviesWrapper>
    );
  }
}
export default MovieComponents;
