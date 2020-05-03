/*
Filename: SponsorRequest.js
 */

import React from "react";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import axios from 'axios';
import Capstone from "../capstones/list";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import 'bootstrap/dist/css/bootstrap.min.css';


const styles = theme => ({
  card: {
    raised: true,
  },
  button: {
    border: '2px solid currentColor',
    borderRadius: 0,
    height: 'auto',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 5}px`,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 18,
  },
  pos: {
    marginBottom: 100,
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0,0,0,.125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: 'auto',
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,.03)',
    borderBottom: '1px solid rgba(0,0,0,.125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
}))(MuiExpansionPanelDetails);



class Marketing extends React.Component {

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      sponsorRequests: [],
      capstoneRequests: [],
    };
  }

  async componentDidMount() {

    console.log('about to try and call requests');
    await axios.get("/sponsor-capstone-requests").then(res =>{
      this.state.capstoneRequests = res.data;
      this.setState({capstoneRequests: this.state.capstoneRequests});
    });
    await axios.get("/sponsorrequests").then(res =>{
      this.state.sponsorRequests = res.data;
      this.setState({sponsorRequests: this.state.sponsorRequests});
    });
  }

  render() {
    const { classes } = this.props;

    return (

        <Container>
          <Row>
            <Col sm={6}>
              <Typography align={"center"}>
                <h1>Sponsor Requests</h1>
              </Typography>
              {this.state.sponsorRequests.map((request) => (
                <Grid container>
                  <Grid xs={12}>
                    <ExpansionPanel square onChange={this.handleChange(('panel1'))}>
                      <ExpansionPanelSummary>
                        Name: {request.User.username}
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        Email: {request.User.email}
                      </ExpansionPanelDetails>
                      <ExpansionPanelDetails>
                        Company: {request.Company}
                      </ExpansionPanelDetails>
                      { request.Accepted &&
                      <ExpansionPanelDetails>
                        Accepted: Yes
                      </ExpansionPanelDetails> }
                      { !request.Accepted &&
                      <ExpansionPanelDetails>
                        Accepted: No
                      </ExpansionPanelDetails> }
                    </ExpansionPanel>
                  </Grid>
                </Grid>

              ))}
            </Col>
            <Col sm={6}>

              <Typography align={"center"}>
                <h1>Capstone Requests</h1>
              </Typography>

              {this.state.capstoneRequests.map((request) => (
                <Grid container>
                  <Grid xs={12}>
                    <ExpansionPanel square onChange={this.handleChange(('panel1'))}>
                      <ExpansionPanelSummary>
                        Sponsor Name: {request.Sponsor.Name}
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        Sponsor Email: {request.Sponsor.Email}
                      </ExpansionPanelDetails>
                      <ExpansionPanelDetails>
                        Capstone: {request.Capstone.CapstoneName}
                      </ExpansionPanelDetails>
                      { request.Accepted &&
                      <ExpansionPanelDetails>
                        Accepted: Yes
                      </ExpansionPanelDetails> }
                      { !request.Accepted &&
                      <ExpansionPanelDetails>
                        Accepted: No
                      </ExpansionPanelDetails> }
                    </ExpansionPanel>
                  </Grid>
                </Grid>
              ))}
            </Col>
          </Row>
        </Container>
    );
  }
}


export default compose(
  withStyles(styles),
)(Marketing);
