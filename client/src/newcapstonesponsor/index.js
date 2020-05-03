/*
File:         CapstoneRequest
Author(s):    Ameera Huda
Description:  This page allows a sponsor to request
              sponsoring a capstone by filling out a form.
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
import AssignmentIcon from '@material-ui/icons/Assignment';
import Autocomplete from "@material-ui/lab/Autocomplete";

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

// Allows form to slide from bottom pf page
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class CapstoneRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      sponsor: [],
      capstones: [],
      selectedCapstone: '',
    };

    this.updateSelectedCapstone = this.updateSelectedCapstone.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.formReset = this.formReset.bind(this);
  }

  // get all possible capstones to sponsor
  componentDidMount() {
    this.props.helmet.setPage("Sponsor a Capstone");
    let id = '';
    axios.get("/users/me").then(async function (response2) {
        id = response2.data._id;
    });

    // get sponsors from strapi
    axios.get("/Sponsors").then(res => {
      const spons = [];
      res.data.forEach(s => {
        spons.push(s);
      });

      // loop throgh sponsors to get current sponsor
      for (let i = 0; i < spons.length; i++) {
        if (spons[i].User && spons[i].User._id === id) {
          console.log('found the sponsor ', spons[i]);
          this.state.sponsor = spons[i];
          this.setState({
            sponsor: spons[i]
          })
        }
      }
    });

    // get capstones from strapi
    axios.get("/capstones").then(res => {
      const caps = [];
      res.data.forEach(c => {
        caps.push(c);
      });
      this.setState(
        {
          capstones: caps,
        });
    });

  }

  updateSelectedCapstone(event, value) {
    this.setState({selectedCapstone: value});
  }

  // handle new sponsor request
  async handleSubmit() {
    if(this.state.selectedCapstone) {
      await axios.post("/sponsor-capstone-requests", {
        Sponsor: this.state.sponsor,
        Capstone: this.state.selectedCapstone,
        Accepted: false,
      });
      this.handleClose();
      this.formReset();
      this.setState({
        afterRequestOpen: true
      })
    }
  }

  formReset() {
    this.setState({
      selectedCapstone: '',
    });
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
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

    return (
      <React.Fragment>
        <Parallax bgImage={"/assets/man-and-woman-shaking-hands-3182767.jpg"} strength={300}
                  className={classes.page}>
          <div style={{height: '100vh'}}>
            <div style={surroundStyle}>
              <Typography className={classes.typography}>
                <Box fontWeight="fontWeightLight" letterSpacing={20} textAlign="center">
                  SPONSOR A CAPSTONE
                </Box>
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                className={classes.button}
                size={"large"}
                startIcon={<AssignmentIcon />}
                onClick={this.handleClickOpen}
              >
                Request Form
              </Button>
              <Dialog
                open={this.state.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle id="sponsor-request-title">{"Sponsor Request Form"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="sponsor-request-description">
                    Which capstone would you like to sponsor today?
                  </DialogContentText>
                  <Autocomplete
                    id="capstones"
                    size="small"
                    options={this.state.capstones}
                    getOptionLabel={option => option.CapstoneName}
                    value={this.state.selectedCapstone}
                    onChange={this.updateSelectedCapstone}
                    renderInput={params => (
                      <TextField {...params} variant="standard" label="Capstones" placeholder="Choose..."/>
                    )}
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
                <DialogTitle id="become-sponsor-title">{"Sponsor Request Form"}</DialogTitle>
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
)(CapstoneRequest);
