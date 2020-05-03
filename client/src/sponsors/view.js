/*
File:         ViewSponsor
Author(s):    Ameera Huda
Description:  This is the view a sponsor page, which includes
              sponsor information, advertisements, and capstones they sponsor.
 */

import React from "react";
import {Link} from "react-router-dom";
import {withHelmet} from "../components/HelmetProvider";
import axios from "axios";
import clsx from "clsx";
import {
  Container,
  Grid,
  Paper,
  Typography,
  withWidth,
  Button, Box, Card, CardMedia, CardContent, CardActions
} from "@material-ui/core";
import compose from "recompose/compose";
import {withStyles} from "@material-ui/core/styles";
import Carousel from 'react-material-ui-carousel'


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
    alignItems: 'center'
  },
  fixedHeight: {
    height: 600,
  },
  fixedHeightSecond: {
    height: 500,
  },
  card: {
    height: '90%',
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


class ViewSponsor extends React.Component {
  constructor(props) {
    super(props);
    let path = window.location.hash ? window.location.hash.slice(1) : window.location.pathname;
    this.state = {
      id: path.substring(path.lastIndexOf("/") + 1),
      sponsor: '',
      logo: '',
      adverts: [],
      capstones: [],
    };
  }

  // get all information of current sponsor
  componentDidMount() {
    this.props.helmet.setPage("View Sponsor");

    // get the selected sponsor
    axios.get("/sponsors/" + this.state.id).then(res => {
      console.log("res", res.data);
      this.setState(
        {
          sponsor: res.data,
          logo: res.data.logo,
          adverts: res.data.adverts,
          capstones: res.data.capstones
        });

      this.props.helmet.setPage(res.data.name);
    })

  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  // check sponsor site
  sponsorWebUrlCheck(e) {
    if(e.startsWith("http")){
      return e;
    }
    return "https://" + e;
  }

  render() {
    const {classes} = this.props;

    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
    const fixedHeightSecondRow = clsx(classes.paper, classes.fixedHeightSecond);

    return (
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper className={fixedHeightPaper}>
              <Typography component="h2" variant="h6" color="primary"
                        gutterBottom>{this.state.sponsor.Name}</Typography>
              { this.state.logo === null ? <img src={'./assets/default-logo.png'} alt={this.state.sponsor.Name}/> : <img src={this.state.logo.url} alt={this.state.sponsor.Name}/> }

              {this.state.sponsor.description &&
                <Typography variant="button"><b>Description </b>{this.state.sponsor.description}</Typography>
              }
              <Box m={3}>
                <Button disabled={!this.state.sponsor.webUrl} variant="outlined" color="primary" onClick={()=> window.open(this.sponsorWebUrlCheck(this.state.sponsor.webUrl), "_blank")}>
                    Visit {this.state.sponsor.Name}'s Website
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper className={fixedHeightPaper}>
              <Typography component="h2" variant="h6" color="primary"
                          gutterBottom>Advertisements from {this.state.sponsor.Name}</Typography>
              {this.state.logo === null ?
              <Carousel>
                  <img height={450} width={500} alt="post" src={'./assets/missing-advert.png'}/>
              </Carousel>
                :<Carousel>
                  {this.state.adverts.map(item => (
                      <img height={450} width={500} alt="post" src={item.url}/>
                    )
                  )}
                </Carousel> }
                </Paper>
          </Grid>
        </Grid>


        <Grid container spacing={3}>
          <Grid item md={12}>
            <Paper className={fixedHeightSecondRow}>
              <Typography component="h2" variant="h6" color="primary"
                          gutterBottom>Capstones Sponsored by {this.state.sponsor.Name}</Typography>

              <Grid container spacing={4}>
              {this.state.capstones.map(card => (
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

            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }

  // render() {
  //   return <React.Fragment>
  //     <img src={logo} className="App-logo" alt="logo"/>
  //     <p>
  //       View Sponsor
  //     </p>
  //     {this.state.id}
  //   </React.Fragment>
  // }
}

// export default withHelmet(withRouter(ViewSponsor));

export default compose(
  withStyles(useStyles),
  withWidth(),
  withHelmet
)(ViewSponsor);
