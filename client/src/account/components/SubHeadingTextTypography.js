/*
Filename: SubHeadingTextTypography.js
Contributors:
Stephen Tate - Wrote entire file.
 */

import React from 'react';
import {Typography, withWidth} from '@material-ui/core';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

class SubHeadingTextTypography extends React.Component {

  constructor(props) {
    super(props);
  }

  static resizeSubheadingText(props) {
    if (props.width === 'xl') {
      return "h4";
    } else if (props.width === 'lg') {
      return "h5";
    } else if (props.width === 'md') {
      return "h5";
    } else if (props.width === 'sm') {
      return "h6"
    }
    return "subtitle1";
  }

  render() {
    return (
      <Typography align={this.props.align} variant={SubHeadingTextTypography.resizeSubheadingText(this.props)}>
        <b>{this.props.text}</b>
      </Typography>
    );
  }
}

SubHeadingTextTypography.propTypes = {
  text: PropTypes.string,
  align: PropTypes.string,
};

SubHeadingTextTypography.defaultProps = {
  align: "left",
};

export default compose(
  withWidth(),
)(SubHeadingTextTypography);
