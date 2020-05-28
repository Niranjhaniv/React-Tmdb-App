import React from "react";
import { Col } from "reactstrap";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import "./../../App.scss";

const MovieThumb = props => {
  const posterImg =
    props.posterPath === null
      ? "https://via.placeholder.com/342x513.png?text=No+Poster+Available"
      : "http://image.tmdb.org/t/p/" + "original" + props.posterPath;
  const { name, date } = props;
  const formattedDate = date;
  const ratingPercent = props.voteRating * 10;
  const RatingBadge = () => {
    if (ratingPercent > 70) {
      return <span className="rating-badge high-rating">{ratingPercent}%</span>;
    } else if (ratingPercent > 30) {
      return (
        <span className="rating-badge medium-rating">{ratingPercent}%</span>
      );
    } else {
      return <span className="rating-badge low-rating">{ratingPercent}%</span>;
    }
  };

  return (
    <Col xs={6} md={4} lg={3} className="movieThumbWrapper pointer">
      <div className="thumb-img-wrapper">
        <Link
          to={{
            pathname: `/movie/${props.id}`,
            state: { query: props.query, page: props.page }
          }}
        >
          <img
            src={posterImg}
            alt={name + " Poster"}
            className="img-fluid movie-thumb-img"
          />
        </Link>
        <RatingBadge />
      </div>
      <p className="movie-name">{name}</p>
      <p className="release-date">
        {" "}
        <Moment format="MMMM-YYYY">{formattedDate}</Moment>
      </p>
    </Col>
  );
};

export default MovieThumb;
