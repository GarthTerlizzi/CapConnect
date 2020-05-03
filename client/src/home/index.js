/*
File:         Home
Author(s):    McKenna Woodrow, Ameera Huda
Description:  This is the landing page and includes information
              about CapConnect. (About page integration)
 */

import React from "react";
import {Parallax} from "react-parallax";
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia, Dialog, DialogContent, DialogContentText, DialogTitle,
  Grid,
  GridList,
  Link,
  Paper, Slide,
  Typography,
  withWidth
} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {AssignmentTurnedIn as AssignmentTurnedInIcon, DoubleArrow as DoubleArrowIcon} from '@material-ui/icons';
import compose from 'recompose/compose';
import {withHelmet} from "../components/HelmetProvider";
import {Redirect, withRouter} from "react-router-dom";
import {withAuth0} from "../react-auth0-spa";
import axios from "axios";


const surroundStyle = {
  background: `rgb(0, 0, 0, 0)`,
  paddingLeft: 20,
  paddingRight: 20,
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
  borderRadius: '10px',
  textAlign: 'center',
  fontSize: '300%',
  height: '202px',
  width: '500px',
};

const styles = theme => ({
  page: {
    minHeight: "100%",
    minWidth: "100%",
    alignContent: "center"
  },
  logobox: {
    width: "75%",
    maxWidth: 500,
    backgroundColor: '#FFFFFF7F',
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 300,
    marginBottom: 300
  },
  space: {
    width: 100,
    height: 500
  },
  typography: {
    fontSize: 100,
    textAlign: 'center',
  },
  subheadings: {
    textAlign: 'center',
  },
  iconPadding: {
    padding: '30px',
    direction: 'row',
    width: 1100,
    height: 200,
  },
  galleryGridList: {
    flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
    width: 1500,
    height: 1000,
  },
  mission: {
    backgroundImage: `url(${"assets/computer-desk-hand-laptop-374631.jpg"})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  whatIs: {
    backgroundImage: `url(${"assets/photo-of-people-looking-on-tablet-3182835.jpg"})`,
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(40, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  valuePaper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: theme.palette.text.secondary,
  },
  valueGrid: {
    height: '70vh',
    padding: theme.spacing(3),
  },
  cardRoot: {
    maxWidth: 345,
    margin: 40,
    maxHeight: 700,

  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
  }

  handleToCreateCapstone = () => {
    if(!this.props.auth0.isAuthenticated){
      //not sure how to redirect to new capstone page right after logging in
      this.props.auth0.loginWithRedirect({returnTo: "/newcapstone"});
    }else if(this.state.user && (this.state.user.role.name === "Professor" || this.state.user.role.name === "Student")){
      this.props.history.push("/newcapstone");
    }else{
      this.setState({
        openCapstoneDialog: true
      })
    }
  };

  handleToBecomeSponsor = () => {
    if(!this.props.auth0.isAuthenticated ) {
      //not sure how to get it to go to the new sponsor page right after logging out
      this.props.history.push("/newsponsor")
    }else if(this.state.user && this.state.user.role.name === "Sponsor"){
      this.props.history.push("/newcapstonesponsor")
    }else if(this.state.user && this.state.user.role.name === "Authenticated"){
      this.props.history.push("/newsponsor")
    }else{
      this.setState({
        openSponsorDialog: true
      })
    }
  };

  componentDidMount() {
    this.props.helmet.setPage(undefined);
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }



  handleClose = () => {
    this.setState({
      open: false,
      openCapstoneDialog: false,
      openSponsorDialog: false
    });
  };

  render() {
    const {classes} = this.props;

    if (!this.state.user &&  axios.defaults.headers.common["Authorization"]) {
      axios.get("/users/me").then(res => this.setState({user: res.data}));
    }

    return (

      <div>
        <Parallax bgImage="assets/fountain2.jpg" strength={500}>
          <div style={{height: 600}}>

            <Paper className={classes.logobox}>
              <img src={"assets/CapConnect.png"} alt="CapConnect" width={"100%"}/>
            </Paper>

          </div>
        </Parallax>

        {/*
      <div>
      <Card>
        <CardContent>
          <Typography text="What is CapConnect?" gutterBottom variant="h5" component="h2"/>
          <Typography variant="body1">
            CapConnect is a Capstone Management System designed for students and sponsors alike. We
            provide students a platform to <b>store, edit, and present</b> their capstone
            projects.
          </Typography>
        </CardContent>
      </Card>
       </div>
       */}


        <Grid container justify="center" component={Paper} elevation={6} style={{backgroundColor: "#b0bec5"}}>
          <Grid container justify="center" className={classes.iconPadding}>
            {/*<Typography variant='h3'>What is CapConnect?</Typography>*/}
            <GridList className={classes.galleryGridList} cellHeight={100}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Link href="#mission">
                  <DoubleArrowIcon fontSize={"large"}/>
                </Link>
                <Link href="#mission">
                  <Typography variant="button">Mission</Typography>
                </Link>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Link href="#whatwedo">
                  <DoubleArrowIcon fontSize={"large"}/>
                </Link>
                <Link href="#whatwedo">
                  <Typography variant="button">What We Do</Typography>
                </Link>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Link href="#goals">
                  <DoubleArrowIcon fontSize={"large"}/>
                </Link>
                <Link href="#goals">
                  <Typography variant="button"> Goals</Typography>
                </Link>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Link href="#getInvolved">
                  <DoubleArrowIcon fontSize={"large"}/>
                </Link>
                <Link href="#getInvolved">
                  <Typography variant="button">Get Involved</Typography>
                </Link>
              </div>
            </GridList>
          </Grid>
        </Grid>


        <Grid container justify="center" id="mission" elevation={6}>
          <Grid item xs={false} sm={4} md={7} className={classes.mission}/>
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square
                style={{backgroundColor: "WhiteSmoke"}}>
            <div className={classes.paper}>
              <Typography variant={"h4"} align={'center'}>The mission of CapConnect is to provide students
                a reliable place to store and present their capstone projects.</Typography>
            </div>
          </Grid>
        </Grid>


        <Grid container justify="center" id="whatwedo">
          <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square
                style={{backgroundColor: "WhiteSmoke"}}>
            <div className={classes.paper}>
              <Typography variant={"h2"} className={classes.subheadings}>What is CapConnect?</Typography>
              <br/>
              <br/>
              <Typography variant={"h5"} align={'center'}>CapConnect is a Capstone Management System
                designed for students and sponsors
                alike. We provide students a platform to <b>store, edit, and
                  present</b> their capstone projects.
                Moreover, CapConnect gives our sponsors a firsthand view of the projects that
                they have sponsored.</Typography>
            </div>
          </Grid>
          <Grid item xs={false} sm={4} md={7} className={classes.whatIs}/>
        </Grid>

        <Grid container className={classes.valueGrid} direction={"column"} justify="center" item
              component={Paper} elevation={6} square style={{backgroundColor: "#b0bec5"}} id="goals">
          <Grid container justify="center">
            <Typography variant={'h2'} className={classes.subheadings}>Our Goals</Typography>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={4}>
              <Paper className={classes.valuePaper}>
                <AssignmentTurnedInIcon fontSize={"large"}/>
                <Typography variant="h6">Goal 1</Typography>
                <Typography variant={"subtitle2"}>To provide students with an easy platform to store and present
                their capstone project</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.valuePaper}>
                <AssignmentTurnedInIcon fontSize={"large"}/>
                <Typography variant="h6">Goal 2</Typography>
                <Typography variant="subtitle2">To connect different departments within a university
                to collaborate on capstone projects</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.valuePaper}>
                <AssignmentTurnedInIcon fontSize={"large"}/>
                <Typography variant="h6">Goal 3</Typography>
                <Typography variant="subtitle2">To connect students with sponsors from real companies to create
                advanced, applicable projects</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.valuePaper}>
                <AssignmentTurnedInIcon fontSize={"large"}/>
                <Typography variant="h6">Goal 4</Typography>
                <Typography variant="subtitle2">To give students applicable real world experience on projects
                in the current job market</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.valuePaper}>
                <AssignmentTurnedInIcon fontSize={"large"}/>
                <Typography variant="h6">Goal 5</Typography>
                <Typography variant="subtitle2">To give professors an easy platform to manage and track the capstone
                projects of their students</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper className={classes.valuePaper}>
                <AssignmentTurnedInIcon fontSize={"large"}/>
                <Typography variant="h6">Goal 6</Typography>
                <Typography variant="subtitle2">To further the relationship between universities and companies</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>


        <Grid container className={classes.valueGrid} item
              component={Paper} elevation={6} square style={{backgroundColor: "WhiteSmoke"}} id="getInvolved">

          <Grid container justify="center">
            <Typography variant={'h2'} className={classes.subheadings}>Get Involved</Typography>
          </Grid>

          {/*\\<Grid item xs={12} sm={6} md={4} justify={'center'}>*/}
          <Grid container justify="center">
            <Card className={classes.cardRoot} raised={true}>
              <CardActionArea >
                <CardMedia
                  component="img"
                  height="300"
                  image={"assets/ideas-whiteboard-person-working-7369.jpg"}
                />
                <CardContent>
                  <Button onClick={this.handleToCreateCapstone} gutterBottom variant="h5" component="h2">
                    Showcase Your Capstone
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card className={classes.cardRoot} raised={true}>
              <CardActionArea >
                <CardMedia
                  component="img"
                  height="300"
                  image={"assets/people-doing-group-hand-cheer-3280130.jpg"}
                />
                <CardContent>
                  <Button onClick={this.handleToBecomeSponsor} gutterBottom variant="h5" component="h2" >
                    Sponsor a Project
                  </Button>
                </CardContent>
              </CardActionArea>
            </Card>

            <Dialog
              open={this.state.openCapstoneDialog}
              TransitionComponent={Transition}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="become-sponsor-title">{"Must be a Student or Professor"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="become-sponsor-description">
                  You must be given Student or Professor permissions to create a capstone. Please contact the admin
                  to request to become a Student or Professor
                </DialogContentText>
              </DialogContent>
            </Dialog>

            <Dialog
              open={this.state.openSponsorDialog}
              TransitionComponent={Transition}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogTitle id="become-sponsor-title">{"Must be a Sponsor"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="become-sponsor-description">
                  You must be a Sponsor to sponsor a capstone. Please login with an approved sponsor account.
                </DialogContentText>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>


      </div>


    );

  }
}

export default compose(
  withStyles(styles),
  withWidth(),
  withHelmet
)(withAuth0(withRouter(Home)));
