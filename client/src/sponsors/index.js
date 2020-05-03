/*
File: SponsorIndex
 */

import React from "react";
import ListPage from "./list"
import ViewPage from "./view"
import {withRouter} from "react-router-dom";

class SponsorsIndex extends React.Component {
  render() {
    let path = window.location.hash ? window.location.hash.slice(1) : window.location.pathname;
    if (path.length <= "/sponsors/".length) {
      return <ListPage {...this.props}/>
    } else {
      return <ViewPage {...this.props}/>
    }
  }
}

export default withRouter(SponsorsIndex);
