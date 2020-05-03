import React from "react";
import axios from "axios";
import {withHelmet} from "../components/HelmetProvider";

// You don't have to assign a class name if you don't need it
// If you do you can move the export down lower and format that as
// `export default FAQPage` or give it the wrappers it needs
class FAQPage extends React.Component {
  // Runs at object creation
  constructor(props) {
    super(props);

    // The state is where you store variables that affect what are seen
    // Every time the state changes render() gets called again
    // Add the 'faq' key to be filled with data later
    this.state = {
      faq: undefined
    };
  }

  // This function runs after all the scripts have loaded in,
  // it's when you're supposed to make outside requests
  componentDidMount() {
    this.props.helmet.setPage("FAQ");

    // Request data from Axios
    axios.get("/faqs").then(res => {
      // Get the existing FAQ object from the state
      let {faq} = this.state;
      // If there isn't one create it
      if (!faq) {
        faq = {};
      }
      // Slot the returned questions into categories
      res.data.forEach(q => {
        if (!faq[q.Category]) {
          faq[q.Category] = [];
        }
        faq[q.Category].push(q);
      });

      // Only modify the state with setState
      // The object in this call is overlaid over the existing state
      // Put the modified FAQ object back in the state
      this.setState({faq: faq});
    })
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  // Called on page load and after every state change
  render() {
    return <React.Fragment>
      {//Wait for the FAQ to be read
        this.state.faq ?
          [(Object.keys(this.state.faq).length === 0 ?
              // If the FAQ is read but empty
              <p key="fail">
                Oops, looks like there's no FAQ yet
              </p>
              :
              // If the FAQ is read
              <React.Fragment>
                {Object.keys(this.state.faq).map(category => <div key={category}>
                  <h1>{category}</h1>
                  {this.state.faq[category].map(q => <div key={q.id}>
                    <h2>Q: {q.Question}</h2>
                    <p>A: {q.Answer}</p>
                  </div>)}
                </div>)}
              </React.Fragment>
          )]
          :
          <p>
            Loading...
          </p>
      }
    </React.Fragment>
  }
}

export default withHelmet(FAQPage)
