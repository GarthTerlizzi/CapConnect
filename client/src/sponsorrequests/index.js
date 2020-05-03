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



class ViewSponsorRequests extends React.Component {

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      sponsorRole: [],
      categories: [],
      requests: [],
      allRequests: [],
    };

    this.approveSponsor = this.approveSponsor.bind(this);
    this.denySponsor = this.denySponsor.bind(this);
  }

  async componentDidMount() {
    axios.get("/users-permissions/roles").then( res =>{
      console.log('these are the roles: ', res.data.roles);

      for(let i=0;i<res.data.roles.length;i++){
        if(res.data.roles[i].name === "Sponsor"){
          this.state.sponsorRole = res.data.roles[i];
          break;
        }
      }
    });



    console.log('about to try and call requests');
    await axios.get("/sponsorrequests").then(res =>{
      this.state.allRequests = res.data;
      this.setState({allRequests: this.state.allRequests});
      console.log('should get all of the requests here');
      console.log(this.state.allRequests);
      console.log('we must now filter requests');
      this.filterRequests();
    });
  }

  async getRequests(){
    await axios.get("/sponsorrequests").then(res =>{
      this.state.allRequests = res.data;
      this.setState({allRequests: res.data});
      console.log('should get all of the requests here');
      console.log(res.data);
      return res.data;
    });
  }

  filterRequests(){
    let requests = this.state.allRequests;
    if(requests !== undefined){
      console.log('filtering...');
      const waitingApprovals = [];
      console.log(requests);
      for (let i = 0; i < requests.length; i++){
        console.log(requests[i]);
        if (requests[i].Accepted === false){
          console.log('match');
          waitingApprovals.push(requests[i]);
        }
      }

      console.log('these are the requests waiting approval');
      console.log(waitingApprovals);
      this.state.requests = waitingApprovals;
      this.setState({requests: waitingApprovals});
      console.log('setting the state');
      console.log(this.state.requests);
    }
  }

  // we are going to approve this request
  approveSponsor(request){
    request.Accepted = true;
    console.log('trying to update the request', request);
    axios.put('/sponsorrequests/' + request._id, {
        Name: request.Name,
        Email: request.Email,
        Company: request.Company,
        Accepted: request.Accepted,
      }).then(() => {
      console.log('should have posted to strapi');
      console.log(request);
      this.getRequests().then(() =>{
        console.log('we now want to filter the remaining requests');
        this.filterRequests();
      })
    });
    console.log('this is the state: ', this.state);

    axios.post('/sponsors', {
      Name: request.User.username,
      Email: request.User.email,
      Company: request.Company,
      User: request.User,
      description: "Contact an admin to change your url, logo, and custom advertisement!",
    });

    console.log('about to post this role to strapi', this.state.sponsorRole)
    axios.put('/users/' + request.User.id ,{
      role: this.state.sponsorRole
    });

    }

    denySponsor(request){
      console.log('we are going to deny this request');
      axios.delete('/sponsorrequests/' + request._id).then(() => {
        this.getRequests().then(() =>{
          console.log('we now want to filter the remaining requests');
          this.filterRequests();
        })
      });
    }


  render() {
    const { classes } = this.props;

    return (

      <div>
        <Typography align={"center"}>
          <h1>Sponsor Requests</h1>
        </Typography>

        {this.state.requests.map((request) => (
          <Grid container>
            <Grid xs={12}>
              <ExpansionPanel square onChange={this.handleChange(('panel1'))}>
                <ExpansionPanelSummary>
                  {request.User.username}
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  Email: {request.User.email}
                </ExpansionPanelDetails>
                <ExpansionPanelDetails>
                  Company: {request.Company}
                </ExpansionPanelDetails>
                <Button onClick={(e) => this.approveSponsor(request)}> Approve </Button>
                <Button onClick={(e) => this.denySponsor(request)}> Deny </Button>
              </ExpansionPanel>
            </Grid>
          </Grid>

        ))}
      </div>
    );
  }
}


export default compose(
  withStyles(styles),
)(ViewSponsorRequests);
