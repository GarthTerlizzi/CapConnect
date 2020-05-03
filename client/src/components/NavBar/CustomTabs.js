import React, {Component} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Tab, Tabs} from '@material-ui/core';
import {Link, withRouter} from "react-router-dom";


const StyledTabs = withStyles(theme => ({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: theme.palette.secondary.main,
    },
  },
}))(props => <Tabs {...props} TabIndicatorProps={{children: <div/>}}/>);

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: theme.palette.primary,
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: theme.typography.pxToRem(15),
    marginRight: theme.spacing(1),
    '&:focus': {
      opacity: 1,
    },
    scrollable: true,
    scrollButtons: 'on',
  },
}))(props => <Tab disableRipple {...props} />);

class CustomizedTabs extends Component {
  constructor(props) {
    super(props);

    let path = this.pathRoot(window.location.hash ? window.location.hash.slice(1) : window.location.pathname);

    this.state = {
      path: path,
      value: this.props.routes.findIndex(route => route.path === path)
    };

    this.handleChange = this.handleChange.bind(this);
  }

  pathRoot(path) {
    path = path.slice(1);
    if (path.indexOf("/") === -1) {
      return "/" + path
    } else {
      return "/" + path.substring(0, path.indexOf("/"));
    }
  }

  handleChange(event, newValue) {
    this.setState({
      path: window.location.pathname,
      value: newValue
    });
  };

  //setValue(undefined);
  render() {
    let path = this.pathRoot(window.location.hash ? window.location.hash.slice(1) : window.location.pathname);
    if (this.state.path !== path) {
      this.setState({
        path: path,
        value: this.props.routes.findIndex(route => route.path === path)
      });
    }
    return (
      <StyledTabs value={this.state.value} onChange={this.handleChange} variant="scrollable" scrollButtons='auto'
                  scaria-label="styled tabs example">
        {this.props.routes.map(route => <StyledTab key={route.path} label={route.name} component={Link}
                                                   to={route.path}/>)}
      </StyledTabs>

    );
  }
}

export default withRouter(CustomizedTabs);
