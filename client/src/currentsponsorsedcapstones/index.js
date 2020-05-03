/*
File:         CurrentSponsoredCapstones
Author(s):    Ameera Huda
Description:  This pages allows a sponsor to view all
              the capstones they are currently sponsoring.
 */

import React, {Component} from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  withStyles,
  withWidth
} from '@material-ui/core';
import compose from 'recompose/compose';
import {Parallax} from 'react-parallax';
import {Link} from "react-router-dom";
import {withHelmet} from "../components/HelmetProvider";

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
  paddingTop: '10%',
};

const styles = theme => ({
  page: {
    minWidth: "100%",
    alignContent: "center"
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
    height: '25vh',
  },
  typography: {
    fontSize: 100,
    textAlign: 'center',
    color: 'black'
  },
  filterPadding: {
    padding: '10px',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  valueGrid: {
    padding: theme.spacing(3),
  }
});

class CurrentSponsoredCapstones extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sponsor: '',
      sponsoredCapstones: [],
      open: false,
    };
  }

  // gets sponsored capstones based on sponsor id
  componentDidMount() {
    this.props.helmet.setPage("Current Sponsored Capstones");
    let id = '';
    axios.get("/users/me").then(async function (response2) {
      id = response2.data._id;
    });

    // gets all sponsors from strapi
    axios.get("/Sponsors").then(res => {
      const spons = [];
      res.data.forEach(s => {
        spons.push(s);
      });

      // loops through sponsors to get current sponsor an the capstones they are sponsoring
      for (let i = 0; i < spons.length; i++) {
        if (spons[i].User && spons[i].User._id === id) {
          this.setState({
            sponsor: spons[i],
            sponsoredCapstones: spons[i].capstones
          })
        }
      }
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

    const {classes} = this.props;

    return (
      <React.Fragment>
        <Parallax bgImage={"/assets/photo-of-people-sitting-near-wooden-table-3183190.jpg"} strength={300}
                  className={classes.page}>
          <div style={{height: '100vh'}}>
            <div style={surroundStyle}>
              <Typography className={classes.typography}>
                <Box fontWeight="fontWeightLight" letterSpacing={20} textAlign="center">
                  CURRENT SPONSORED CAPSTONES
                </Box>
              </Typography>
            </div>
          </div>
        </Parallax>


        <Grid container className={classes.valueGrid}>
          <Container maxWidth="lg">

            <Grid container spacing={4}>
              {this.state.sponsoredCapstones.map(card => (
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
                      <Typography>
                        {card.Description}
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
      </React.Fragment>
    );
  }

}

export default compose(
  withStyles(styles),
  withWidth(),
  withHelmet
)(CurrentSponsoredCapstones);
