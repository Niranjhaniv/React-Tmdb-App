/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import "../../App.scss";
import backButton from "./../../assets/media/backButton.png";
import styled from "styled-components";
import { API_KEY, PATH_BASE, PATH_MOVIE, PATH_CONFIG } from "../../api/api";
import { utils } from "styled-minimal";
import theme from "../../modules/theme";
import Moment from "react-moment";
const { responsive } = utils;

const MovieDetailsWrapper = styled.div`
  width: 100%;
  position: relative;
  min-height: 100vh;
`;

const OutputCover = styled.div`
  display: block;
  margin: 0 auto;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  hr {
    border: none;
    border-bottom: 1px solid #0f303d;
  }
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
      max-width: 710px;
      `,
      xl: `
      `
    })};
`;

const Title = styled.div`
  position: relative;
  display: block;
  padding: 30px 0 30px 185px;
  z-index: 10;
  min-height: 185px;
  h2 {
    margin-top: 0;
  }
`;
const PictureCover = styled.div`
  position: absolute;
  display: block;
  border-radius: 8px;
  background: #15272e;
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.5), 0px 8px 16px rgba(0, 0, 0, 0.5),
    0px 16px 32px rgba(0, 0, 0, 0.5);
  width: 155px;
  height: 233px;
  top: -70px;
  left: 0;
  img {
    display: block;
    width: 155px;
    height: 233px;
    border: none;
    margin: 0;
    border-radius: 8px;
    overflow: hidden;
  }
`;
const Information = styled.div`
  position: relative;
  display: block;
  font-size: 12px;
  line-height: 21px;
  font-family: Montserrat, sans-serif;
  color: ${theme.palette.lightBlue};
`;
const ContentWrapper = styled.div`
  position: relative;
  display: block;
  margin-bottom: 80px;
  line-height: 24px;
  font-size: 16px;
  div {
    color: #9fbbc7;
  }
`;

class MovieDetails extends Component {
  state = {
    configuration: "",
    movieInfo: ""
  };

  componentWillMount() {
    this.getConfiguration();
  }

  getConfiguration = () => {
    fetch(`${PATH_BASE}${PATH_CONFIG}?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(data => this.setConfiguration(data));
  };

  setConfiguration = data => {
    const movieId = this.props.match.params.id;
    this.setState(
      {
        configuration: data
      },
      () => {
        this.getMovieInfo(movieId);
      }
    );
  };

  handleBtnClick = () => {
    this.props.history.push({
      pathname: "/",
      state: {
        query: this.props.location.state.query,
        page: this.props.location.state.page
      }
    });
  };

  getMovieInfo = movieId => {
    fetch(
      `${PATH_BASE}${PATH_MOVIE}/${movieId}?api_key=${API_KEY}&language=en-US`
    )
      .then(response => response.json())
      .then(data => this.setMovieInfo(data));
  };

  setMovieInfo = data => {
    this.setState({
      movieInfo: data
    });
  };
  render() {
    if (this.state.movieInfo === "") {
      return (
        <div className="moviePageWrapper">
          <Container>
            <Row>
              <Col>
                <p className="text-center">Loading Movie Information...</p>
              </Col>
            </Row>
          </Container>
        </div>
      );
    } else {
      let bgStyle;
      const baseUrl = this.state.configuration.images.base_url;
      let output;
      const lgBgSize = this.state.configuration.images.backdrop_sizes[2];
      const mdPosterSize = this.state.configuration.images.poster_sizes[3];

      // Define Background Size
      const bgUrl = this.state.movieInfo.backdrop_path;
      const bgImage = baseUrl + lgBgSize + bgUrl;
      const movieBg = {
        backgroundImage: `url(${bgImage})`
      };

      let runtimeH;
      let runtimeM;
      if (
        this.state.movieInfo.runtime &&
        Math.floor(this.state.movieInfo.runtime / 60) > 0
      ) {
        runtimeH = `${Math.floor(this.state.movieInfo.runtime / 60)}h `;
      }
      if (
        this.state.movieInfo.runtime &&
        this.state.movieInfo.runtime % 60 !== 0
      ) {
        runtimeM = `${this.state.movieInfo.runtime % 60}min `;
      }

      //Define Poster Size
      const posterUrl = this.state.movieInfo.poster_path;
      const posterImg =
        posterUrl === null
          ? "https://via.placeholder.com/342x513.png?text=No+Poster+Available"
          : baseUrl + mdPosterSize + posterUrl;
      const img = <img src={posterImg} alt="Back to Homepage" />;

      if (this.state.movieInfo && this.state.movieInfo.backdrop_path) {
        bgStyle = {
          backgroundImage: `url(https://image.tmdb.org/t/p/w1400_and_h450_face/${this.state.movieInfo.backdrop_path})`
        };
      }
      output = (
        <OutputCover>
          <Title>
            <PictureCover>{img}</PictureCover>
            <h2>{this.state.movieInfo.title}</h2>
            <Information>
              <div>
                <Moment format="YYYY">
                  {this.state.movieInfo.release_date}
                </Moment>
                {" · "}
                {Math.round(this.state.movieInfo.vote_average * 10)}% User Score
              </div>
              <div>
                {runtimeH} {runtimeM}
              </div>
            </Information>
          </Title>
          <hr />
          <ContentWrapper>
            <h3>Overview</h3>
            <div>{this.state.movieInfo.overview}</div>
          </ContentWrapper>
        </OutputCover>
      );

      return (
        <div className="moviePageWrapper">
          <MovieDetailsWrapper
            className="moviePageWrapper"
            key="MovieWidget"
            data-testid="MovieWidgetWrapper"
          >
            <div className="movie-header-wrapper" style={movieBg}>
              <img
                src={backButton}
                alt="Back to Homepage"
                className="movie-back-arrow pointer"
                onClick={this.handleBtnClick}
              />
            </div>
            {output}
          </MovieDetailsWrapper>
        </div>
      );
    }
  }
}

export default MovieDetails;
