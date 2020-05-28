import React from "react";
import { withRouter } from "react-router-dom";
import LogoMovie from "../../assets/media/logo.png";
import coverimg from "../../assets/media/header-bg.png";
import styled from "styled-components";
import MovieComponents from "../../components/MovieComponents/MovieComponents";
import { API_KEY, PATH_BASE, PATH_CONFIG, DEFAULT_PAGE } from "../../api/api";
const HomeContainer = styled.div`
  min-height: 100vh;
`;

const Header = styled.div`
  position: relative;
  height: 192px;
  box-sizing: border-box;
  padding-top: 60px;
  background: radial-gradient(
    82.98% 213.08% at 50% 0%,
    rgba(5, 112, 172, 0.3) 0%,
    rgba(8, 27, 35, 0) 50%
  );
  img {
    display: block;
    margin: 0 auto;
    height: 59px;
  }
  &:after {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url(${coverimg});
    background-position: center;
  }
`;

class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    const { query } = this.props.location.state;
    let page = DEFAULT_PAGE;
    if (this.props.location.state.page) {
      page = this.props.location.state.page;
    }

    this.state = {
      configuration: null,
      query: query === undefined ? "" : query,
      page: page
    };
  }
  componentWillMount() {
    this.getConfiguration();
  }

  getConfiguration = () => {
    fetch(`${PATH_BASE}${PATH_CONFIG}?api_key=${API_KEY}`)
      .then(response => response.json())
      .then(data => this.setConfiguration(data));
  };

  setConfiguration = data => {
    this.setState({
      configuration: data
    });
  };
  render() {
    return (
      <HomeContainer className="HomeContainer">
        <Header>
          <img src={LogoMovie} alt="The Movie DB" />
        </Header>
        {this.state.configuration !== null && (
          <MovieComponents
            query={this.state.query}
            page={this.state.page}
            baseurl={this.state.configuration.images.secure_base_url}
            posterSize={this.state.configuration.images.poster_sizes[3]}
          />
        )}
      </HomeContainer>
    );
  }
}
export default withRouter(HomeComponent);
