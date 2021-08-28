import React from "react"

import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import Home from "./pages/home"
import Map from "./pages/map"

export default class App extends React.Component{

  constructor(props) {
    super(props)
    this.props = props
  }


  render()
  {
    return (
      <Router {...this.props}>
        <Switch>
          <Route exact path="/">
            <Home/>	
          </Route>
          <Route path="/:lat/:lng/:time">
            <Map/>	
          </Route>
        </Switch>
      </Router>
    )
  }

}