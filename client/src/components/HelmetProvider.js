import React from "react";
import {Helmet} from "react-helmet";
import hoistNonReactStatics from "hoist-non-react-statics";

export const HelmetContext = React.createContext({
  setPage: () => {
  },
  setUniversity: () => {
  },
  setColor: () => {
  }
});

class HelmetProvider extends React.Component {
  static contextType = HelmetContext;

  constructor(props) {
    super(props);

    this.setPage = this.setPage.bind(this);
    this.setUniversity = this.setUniversity.bind(this);
    this.setColor = this.setColor.bind(this);

    this.state = {
      page: undefined,
      university: undefined,
      color: undefined,
      context: {
        setPage: this.setPage,
        setUniversity: this.setUniversity,
        setColor: this.setColor
      }
    };
  }

  setPage(page) {
    this.setState({
      page: page
    })
  }

  setUniversity(university) {
    this.setState({
      university: university
    })
  }

  setColor(color) {
    this.setState({
      color: color
    })
  }

  render() {
    return <HelmetContext.Provider value={this.state.context}>
      <Helmet>
        <title>{
          (this.state.page ? this.state.page + " | " : "") +
          "CapConnect" +
          (this.state.university ? " | " + this.state.university : "")
        }</title>
      </Helmet>
      {this.props.children}
    </HelmetContext.Provider>
  }
}

export function useHelmet() {
  return React.useContext(HelmetContext);
}

export function withHelmet(Component) {
  function WithHelmet(props) {
    const helmet = React.useContext(HelmetContext);
    return <Component helmet={helmet} {...props}/>
  }

  hoistNonReactStatics(WithHelmet, Component);

  return WithHelmet;
}

export default HelmetProvider;
