/*
File: ViewDepartment
 */

import React from "react";
import logo from "../logo.svg";
import {withRouter} from "react-router-dom";
import {withHelmet} from "../components/HelmetProvider";

class ViewDepartment extends React.Component {
  constructor(props) {
    super(props);
    let path = window.location.hash ? window.location.hash.slice(1) : window.location.pathname;
    this.state = {
      id: path.substring(path.lastIndexOf("/") + 1)
    };
  }

  componentDidMount() {
    this.props.helmet.setPage("View Department");
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  render() {
    return <React.Fragment>
      <img src={logo} className="App-logo" alt="logo"/>
      <p>
        View Department
      </p>
      {this.state.id}
    </React.Fragment>
  }
}

export default withHelmet(withRouter(ViewDepartment));
