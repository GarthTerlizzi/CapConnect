/*
File:         ListSponsors
Author(s):    Ameera Huda
Description:  This is the list of sponsors page.
 */

import React, {Component} from "react";
import axios from "axios";
import {
  Typography, Grid, Container, Card,
  CardContent, CardMedia, withWidth,
  withStyles, Box, ButtonBase
}
  from '@material-ui/core';
import compose from 'recompose/compose';
import { Parallax } from 'react-parallax';
import {withHelmet} from "../components/HelmetProvider";
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
    height: '5vh',
    '&:hover': {
      background: 'whiteSmoke',
    },
  },
  typography: {
    fontSize: 100,
    textAlign: 'center',
  },
  valueGrid: {
    padding: theme.spacing(3),
  },
  cardAction: {
    display: 'block',
    textAlign: 'initial'
  },
});

class ListSponsors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sponsors: [],
    };

  }

  // get all sponsors
  async componentDidMount() {
    this.props.helmet.setPage("Sponsors");

    // get sponsors from strapi
    axios.get("/Sponsors").then(res => {
      const spons = [];
      res.data.forEach(s => {
        spons.push(s);
      });
      this.setState(
        {
          sponsors: spons
        });
    });
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  static handleTileClick(id){
    window.location = "/ViewASponsor/" + id;
  }

  state = {
    open: false,
    onClose: '',
  };

  handleClickOpen = () => {
    this.setState({ open: true});
  };

  handleClose = () => {
    this.filterCapstones();
    this.setState({ open: false});
  };

  render() {

    const { classes } = this.props;

    return (
      <React.Fragment>
        <Parallax bgImage={"/assets/photo-of-people-near-wooden-table-3184418.jpg"} strength={500}
          className={classes.page}>
          <div style={{height: '100vh'}}>
            <div style={surroundStyle}>
              <Typography className={classes.typography}>
                <Box fontWeight="fontWeightLight" letterSpacing={20} textAlign="center">
                  SPONSORS
                </Box>
              </Typography>
            </div>
          </div>
        </Parallax>

        <Grid container className={classes.valueGrid} alignItems="center"
              justify="center">
          <Container maxWidth="md">
            <Grid container spacing={4} alignItems="center"
                  justify="center">
              {this.state.sponsors.map(card => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <ButtonBase
                      className={classes.cardAction}
                      component={Link}
                      to={"/sponsors/" + card.id}
                    >
                      { card['logo'] == null ?
                        <CardMedia
                          className={classes.cardMedia}
                          image={'./assets/default-logo.png'}
                        /> :
                        <CardMedia
                          className={classes.cardMedia}
                          image={card['logo'].url}
                          title={card['logo'].Name}
                        /> }
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="button" component="h2" align={'center'}>
                          {card.Name}
                        </Typography>
                      </CardContent>
                    </ButtonBase>
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
)(ListSponsors);

