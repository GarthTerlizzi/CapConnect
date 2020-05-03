import React from "react";
import {ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Link as RouterLink} from "react-router-dom";

export default class extends React.Component {
  render() {
    return <ListItem button key={this.props.text} component={RouterLink} to={this.props.to}>
      <ListItemIcon>{this.props.children}</ListItemIcon>
      <ListItemText primary={this.props.text}/>
    </ListItem>
  }
}
