import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import HomeComponent from "./switchRoutes/HomeComponent/HomeComponent";
import MovieDetails from "./switchRoutes/MovieDetailsComponent/MovieDetails";
import history from "./modules/history";

import "./App.scss";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <Router history={history}>
        <div className="App">
          <div className="Head">
            <Switch>
              <Route path="/" exact component={HomeComponent} />
              <Route path="/movie/:id" exact component={MovieDetails} />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
export default App;
