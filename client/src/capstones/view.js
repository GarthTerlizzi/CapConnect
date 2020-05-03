/*
File:         ViewCapstone
Author(s):    Ameera Huda
Description:  This is the view a capstone page, which includes
              capstone details, progress, images, and team information.
 */

import React from 'react';
import clsx from 'clsx';
import {withAuth0} from "../react-auth0-spa";
import {withStyles} from '@material-ui/core/styles';
import {
  Avatar,
  Container,
  Grid,
  GridList,
  GridListTile,
  Paper,
  Tooltip,
  Typography,
  withWidth,
  Chip, Box
} from '@material-ui/core';
import compose from "recompose/compose";
import axios from 'axios';
import AnimatedProgressProvider from "./components/AnimatedProgressProvider";
import {buildStyles, CircularProgressbar} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {easeQuadInOut} from "d3-ease";
import {withHelmet} from "../components/HelmetProvider";
import 'react-sharingbuttons/dist/main.css';
import {
  EmailShareButton,
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  RedditIcon,
  TwitterIcon
} from "react-share";

const useStyles = theme => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
  },
  midPaper: {
    padding: theme.spacing(0),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'row',
  },
  profilePaper: {
    width: theme.spacing(50),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'left',
  },
  descriptionPaper: {
    width: theme.spacing(50),
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'left',
  },
  fixedHeight: {
    height: 300,
  },
  fixedHeightSecond: {
    height: 400,
  },
  galleryRoot: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  galleryGridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    width: 850,
    height: 600,
  },
  galleryTile: {
    height: '500px'
  },
  avatar: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  chipRoot: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },
});

// styling for team information tooltip
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

class ViewCapstone extends React.Component {
  constructor(props) {
    super(props);
    let path = window.location.hash ? window.location.hash.slice(1) : window.location.pathname;
    this.state = {
      id: path.substring(path.lastIndexOf("/") + 1),
      capstone: '',
      capstoneName: '',
      department: '',
      course: '',
      team: '',
      faculty: '',
      pictures: [],
      displayPhoto: '',
      sponsors: '',
      startDate: '',
      endDate: '',
      progress: '',
      facultyProfilePic: '',
      groupMembers: [],
      sponsorList: [],
      tags: [],
      schoolColorPrimary: '#154734',
      schoolColorSecondary: '#FFB81C',
    };
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  //Takes ugly JSON date and returns readable date
  static formatDate(dateToFormat) {
    var date = new Date(dateToFormat);
    return date.toUTCString().split(' ').slice(0, 4).join(' ');
  }

  // takes array of names and returns string of commo separated names
  static formatListOfUserNames(listToFormat) {
    let usernames = [];
    listToFormat.forEach(item => {
      usernames.push(item.username);
    });
    return usernames.join(", ");
  }

  // takes array of names and returns string of commo separated names
  static formatListOfNames(listToFormat) {
    let names = [];
    listToFormat.forEach(item => {
      names.push(item.name);
    });
    return names.join(", ");
  }

  // calculates progress bar value
  static calculateProgress(startDate, endDate) {
    if(!startDate && !endDate) {
      return 0;
    }
    var start = new Date(startDate),
      end = new Date(endDate),
      today = new Date();
    var q = today - start;
    var d = end - start;
    var progress = Math.round((q / d) * 100);
    if (progress <= 0)
      return 0;
    else if (progress <= 100) {
      return progress;
    } else {
      return 100;
    }
  }

  // gets al information needed for current capstone
  componentDidMount() {
    this.props.helmet.setPage("View Capstone");

    // gets current capstone information from strapi
    axios.get("/capstones/" + this.state.id).then(res => {
      this.setState(
        {
          capstone: res.data,
        });

      this.setState({
        capstoneName: this.state.capstone.CapstoneName,
        department: this.state.capstone.department,
        faculty: this.state.capstone.moderator,
        pictures: this.state.capstone.Pictures,
        displayPhoto: this.state.capstone.DisplayPhoto,
        groupMembers: this.state.capstone.creators,
        sponsorList: this.state.capstone.sponsors,
        tags: this.state.capstone.tags,
      });


      if(this.state.faculty) {
        console.log("in faculty", this.state.faculty)
        this.setState({
          facultyProfilePic: this.state.capstone.moderator.ProfilePicture,
        })
      }

      // formats names into presentable string
      let tempTeam = ViewCapstone.formatListOfUserNames(this.state.groupMembers);
      let tempSponsors = ViewCapstone.formatListOfNames(this.state.sponsorList);
      // prepares date values for progress bar
      let tempStartDate = ViewCapstone.formatDate(this.state.capstone.StartDate);
      let tempEndDate = ViewCapstone.formatDate(this.state.capstone.EndDate);
      let tempProgress = ViewCapstone.calculateProgress(this.state.capstone.StartDate, this.state.capstone.EndDate);
      this.setState({
        team: tempTeam,
        sponsors: tempSponsors,
        startDate: tempStartDate,
        endDate: tempEndDate,
        progress: tempProgress,
      });

      this.props.helmet.setPage(res.data.CapstoneName);
    })
  }

  render() {
    const {classes} = this.props;

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightSecondRow = clsx(classes.paper, classes.fixedHeightSecond);

    const fillerText = "This project called " + this.state.capstoneName + " from the " + this.state.department.name + " department is making some serious progress. Come check it out!";
    const url = "CapConnect.org";


    return (
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightPaper}>
              <Typography component="h2" variant="h6" color="primary"
                          gutterBottom>{this.state.capstoneName}</Typography>
              <Paper className={classes.midPaper} elevation={0}>
                <Paper className={classes.profilePaper} elevation={0}>
                  <img src={this.state.displayPhoto ? this.state.displayPhoto.url : ''} alt={this.state.displayPhoto ? this.state.displayPhoto.name : ''}/>
                </Paper>
                <Paper className={classes.descriptionPaper} elevation={0}>
                  <Typography variant="button"><b>Description </b>{this.state.capstone.Description}</Typography>
                  <Typography variant="button"><b>Department </b>{this.state.department ? this.state.department.name : ''}</Typography>
                  <Typography variant="button"><b>Start Date </b>{this.state.startDate}</Typography>
                  <Typography variant="button"><b>End Date </b>{this.state.endDate}</Typography>
                  <div className={classes.chipRoot}>
                    {this.state.tags.map(tag => (
                      <Chip label={tag.Name}/>
                    ))}
                  </div>
                </Paper>
              </Paper>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4} lg={3}>
            <Paper className={fixedHeightPaper}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>Progress</Typography>
              <AnimatedProgressProvider
                valueStart={0}
                valueEnd={this.state.progress}
                duration={1.4}
                easingFunction={easeQuadInOut}
                // repeat
              >
                {value => {
                  const roundedValue = Math.round(value);
                  return (
                    <CircularProgressbar
                      value={value}
                      text={`${roundedValue}%`}
                      /* This is important to include, because if you're fully managing the
                animation yourself, you'll want to disable the CSS animation. */
                      styles={buildStyles({
                        pathTransition: "none",
                        textColor: this.state.schoolColorPrimary,
                        pathColor: this.state.schoolColorSecondary
                      })}
                    />
                  );
                }}
              </AnimatedProgressProvider>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper className={fixedHeightSecondRow}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>Team</Typography>
              <Typography variant="button"><b>Faculty in Charge</b></Typography>
              <div  className={classes.avatar}>
                <HtmlTooltip
                  interactive
                  title={
                    <React.Fragment>
                      <Typography color="inherit">{this.state.faculty ? this.state.faculty.username : ''}</Typography>
                      <em>{this.props.auth0.isAuthenticated && this.state.faculty ? this.state.faculty.email : ''}</em>
                    </React.Fragment>
                  }
                >
                  <Avatar alt={this.state.faculty ? this.state.faculty.username : ''}
                          src={this.state.facultyProfilePic ? this.state.facultyProfilePic.url : ''}/>
                </HtmlTooltip>

              </div>
              <Typography variant="button"><b>Group Members</b></Typography>
              <div className={classes.avatar}>
                {this.state.groupMembers.map(member => (
                  <HtmlTooltip
                    interactive
                    title={
                      <React.Fragment>
                        <Typography color="inherit">{member.username}</Typography>
                        <em>{this.props.auth0.isAuthenticated ? member.email : ''}</em>
                      </React.Fragment>
                    }
                  >
                    <Avatar alt={member.username} src={member.ProfilePicture ? member.ProfilePicture.url : ''}/>
                  </HtmlTooltip>
                ))}
              </div>
              <Typography variant="button"><b>Current Sponsors</b></Typography>
              <div className={classes.avatar}>
                {this.state.sponsorList.map(sponsor => (
                  <HtmlTooltip
                    interactive
                    title={
                      <React.Fragment>
                        <Typography color="inherit">{sponsor.Name}</Typography>
                      </React.Fragment>
                    }
                  >
                    <Avatar alt={sponsor.Name} src={sponsor.url ? sponsor.url : ''}/>
                  </HtmlTooltip>

                ))}
              </div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={8} lg={9}>
            <Paper className={fixedHeightSecondRow}>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>Photo Gallery</Typography>
              <div className={classes.galleryRoot}>
                <GridList className={classes.galleryGridList} cellHeight={300} cols={2.5}>
                  {this.state.pictures.map(tile => (
                    <GridListTile className={classes.galleryTile} key={tile.id}>
                      <img src={tile.url} alt={tile.name}/>
                    </GridListTile>
                  ))}
                </GridList>
              </div>
            </Paper>
          </Grid>
        </Grid>

        <Grid container justify="center" spacing={2}>
          <Grid item>
            <EmailShareButton url={fillerText} subject={this.state.capstoneName}>
              <EmailIcon size={32} round={true}/>
            </EmailShareButton>
          </Grid>
          <Grid item>
            <FacebookShareButton url={fillerText} quote={"Facebook"}>
              <FacebookIcon size={32} round={true}/>
            </FacebookShareButton>
          </Grid>
          <Grid item>
            <TwitterShareButton url={url} title={fillerText + " #CapConnect"}>
              <TwitterIcon size={32} round={true}/>
            </TwitterShareButton>
          </Grid>
          <Grid item>
            <RedditShareButton url={fillerText}>
              <RedditIcon size={32} round={true}/>
            </RedditShareButton>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default compose(
  withStyles(useStyles),
  withWidth(),
  withHelmet,
)(withAuth0(ViewCapstone));

