/*
File:         ListDepartments
Author(s):    Ameera Huda
Description:  This is the list of departments page and allows
              user to see all the capstones in a department.
 */

import React from "react";
import {withHelmet} from "../components/HelmetProvider";
import { Parallax } from 'react-parallax';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Slide,
  withStyles,
  withWidth,
  Grid,
  Container,
  DialogTitle,
  DialogContent,
  Dialog,
  CardMedia
} from "@material-ui/core";
import compose from "recompose/compose";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {Link} from "react-router-dom";

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
  root: {
    minWidth: 275,
  },
  valueGrid: {
    padding: theme.spacing(5),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
    overflow: 'auto',
    height: '15vh',
  },
});

// allows capstones to slide in
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class ListDepartments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departments: [],
      open: false,
      capstonesToShow: [],
      currentDepartment: ''
    }

    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  // gets all departments
  componentDidMount() {
    this.props.helmet.setPage("Departments");

    // get departments from strapi
    axios.get("/departments").then(res => {
      const deps = [];
      res.data.forEach(d => {
        deps.push(d);
      });
      this.setState(
        {
          departments: deps
        });
    });
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  handleClickOpen = (capstones, depName) => {
    this.setState({
      open: true,
      capstonesToShow: capstones,
      currentDepartment: depName
    });
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
        <Parallax bgImage={"/assets/engineers-designing-lights-3862131.jpg"} strength={150}
                  className={classes.page}>
          <div style={{height: '100vh'}}>
            <div style={surroundStyle}>
              <Typography className={classes.typography}>
                <Box fontWeight="fontWeightLight" letterSpacing={20} textAlign="center">
                  DEPARTMENTS
                </Box>
              </Typography>
            </div>
          </div>
        </Parallax>

        <Grid container className={classes.valueGrid}>
          <Container maxWidth="lg">
            <Grid container spacing={4}>
              {this.state.departments.map(department => (
                <Grid item key={department} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {department.name}
                      </Typography>
                      <Typography>
                        {department.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        onClick={() => this.handleClickOpen(department.capstones, department.name)}
                      >
                        View Capstones
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Dialog
              open={this.state.open}
              TransitionComponent={Transition}
              keepMounted
              onClose={this.handleClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
              fullWidth={true}
              maxWidth={"md"}
            >
              <DialogTitle id="department-capstones-title">{this.state.currentDepartment + " Capstones"}</DialogTitle>
              <DialogContent>
                <Grid container className={classes.valueGrid}>
                  <Container maxWidth="lg">
                    <Grid container spacing={4}>
                      {this.state.capstonesToShow.map(card => (
                        <Grid item key={card} xs={12} sm={6} md={4}>
                          <Card className={classes.card}>
                            <CardMedia
                              className={classes.cardMedia}
                              image={card['DisplayPhoto'] ? card['DisplayPhoto'].url : ''}
                              title={card['DisplayPhoto'] ? card['DisplayPhoto'].name : ''}
                            />
                            <CardContent className={classes.cardContent}>
                              <Typography gutterBottom variant="h5" component="h2">
                                {card.CapstoneName}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button
                                size="small"
                                color="primary"
                                component={Link}
                                to={"/capstones/" + card['_id']}
                              >
                                View
                              </Button>
                            </CardActions>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Container>
                </Grid>
              </DialogContent>
            </Dialog>
          </Container>
        </Grid>

      </React.Fragment>
    );


  }
}

export default compose(
  withStyles(styles),
  withWidth(),
  withHelmet
)(ListDepartments);
