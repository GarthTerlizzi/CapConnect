/*
File:         NewSponsor
Author(s):    Ameera Huda
Description:  This page allows a user to submit
              a request to become a sponsor.
 */

import React from "react";
import axios from "axios";
import {withHelmet} from "../components/HelmetProvider";
import { Parallax } from 'react-parallax';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  TextField,
  Slide,
  withStyles, withWidth
} from "@material-ui/core";
import compose from "recompose/compose";
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

const surroundStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  bottom: '0',
  right: '0',
  width: '100%',
  height: '100%',
  backgroundColor: `rgba(255,255,255, 0.5)`,
  content: '',
  display: 'block',
  paddingTop: '20%',
};

const styles = theme => ({
  page: {
    minWidth: "100%",
    alignContent: "center",
  },
  typography: {
    fontSize: 100,
    textAlign: 'center',
  },
  button: {
    margin: theme.spacing(10),
    border: '2px solid'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
});

// allows form to slide from bottom of page
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class NewSponsor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      afterRequestOpen: false,
      user: [],
      name: '',
      email: '',
      company: '',
      errorText: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formReset = this.formReset.bind(this);
  }

  // gets current user
  componentDidMount() {
    this.props.helmet.setPage("Become a Sponsor");

    axios.get("/users/me").then( res =>{
      console.log('this is this user: ', res.data);
      this.state.user = res.data;
      this.setState( {user: res.data});
    });

  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  // handles become a sponsor request form
  handleSubmit() {
    if(this.state.company === '') {
      this.setState({
        errorText: "Field cannot be empty."
      })
    } else {
      axios.post("/Sponsorrequests", {
        User: this.state.user,
        Company: this.state.company,
        Accepted: false,
      });
      this.handleClose();
      this.formReset();
      this.setState({
        afterRequestOpen: true,
        errorText: ''
      })
    }
  }

  // resets form after sumittal
  formReset() {
    this.setState({
      name: '',
      email: '',
      company: ''
    });
  }

  handleChange(event) {
    this.setState({[event.target.id] : event.target.value});
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({
      open: false,
      afterRequestOpen: false
    });
  };

  render() {

    const { classes } = this.props;
    if ( this.state.user.email !== undefined){
      console.log("is a registered user", this.state.user)
    }
    else{
      console.log("is not a registered user", this.state.user);
      return (
        <React.Fragment>
          <Parallax bgImage={"/assets/man-and-woman-shaking-hands-3182767.jpg"} strength={300}
                    className={classes.page}>

            <div style={{height: '100vh'}}>
              <div style={surroundStyle}>
                <Typography className={classes.typography}>
                  <Box fontWeight="fontWeightLight" letterSpacing={20} textAlign="center">
                    BECOME A SPONSOR
                  </Box>
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  size={"large"}
                  startIcon={<EmojiPeopleIcon />}
                >
                  You must register first!
                </Button>
              </div>
            </div>
          </Parallax>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <Parallax bgImage={"/assets/man-and-woman-shaking-hands-3182767.jpg"} strength={300}
                  className={classes.page}>

          <div style={{height: '100vh'}}>
            <div style={surroundStyle}>


              <Typography className={classes.typography}>
                <Box fontWeight="fontWeightLight" letterSpacing={20} textAlign="center">
                  BECOME A SPONSOR
                </Box>
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                size={"large"}
                startIcon={<EmojiPeopleIcon />}
                onClick={this.handleClickOpen}
              >
                Join Us Today
              </Button>
              <Dialog
                open={this.state.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="become-sponsor-title">{"Get Involved"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="become-sponsor-description">
                    If you are interested in sponsoring a capstone,
                    please enter your contact information here.
                    We will reach out to you soon with additional information.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="company"
                    label="Company"
                    type="text"
                    value={this.state.company}
                    fullWidth
                    required
                    onChange={this.handleChange}
                    error ={this.state.errorText.length === 0 ? false : true }
                    helperText={this.state.errorText}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={this.handleSubmit} color="primary">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={this.state.afterRequestOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="become-sponsor-title">{"Get Involved"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="become-sponsor-description">
                    Thank you, we will contact you soon!
                  </DialogContentText>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Parallax>
      </React.Fragment>
    );
  }
}

export default compose(
  withStyles(styles),
  withWidth(),
  withHelmet
)(NewSponsor);
