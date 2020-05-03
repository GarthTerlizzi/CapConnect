/*
File:         Capstone
Author(s):    Ameera Huda, Brandon Mork
Description:  This is the list of capstones page
              and includes capstone filtering functionality.
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  withStyles,
  withWidth
} from '@material-ui/core';
import compose from 'recompose/compose';
import {Parallax} from 'react-parallax';
import Autocomplete from '@material-ui/lab/Autocomplete';
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
  content: '',
  display: 'block',
  paddingTop: '20%',
  background: `rgb(0, 0, 0, 0)`,
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

class Capstone extends Component {

  constructor(props) {
    super(props);
    this.state = {
      caps: [],
      capstones: [],
      depts: [],
      spons: [],
      tags: [],
      searchField: '',
      filteredDepartmentList: [],
      filteredSponsorList: [],
      filteredTagList: [],
      open: false,
      onClose: '',
      myID: '',
    };
    this.updateFilteredDepartments = this.updateFilteredDepartments.bind(this);
    this.filterCapstones = this.filterCapstones.bind(this);
    this.liveSearch = this.liveSearch.bind(this);
    this.normalSearch = this.normalSearch.bind(this);
    this.filterReset = this.filterReset.bind(this);
    this.updateFilteredSponsors = this.updateFilteredSponsors.bind(this);
    this.updateFilteredTags = this.updateFilteredTags.bind(this);
  }

  // get capstones and filter options
  async componentDidMount() {
    this.props.helmet.setPage("Capstones");

    // get all capstones from strapi
    axios.get("/capstones").then(res => {
      const caps = [];
      res.data.forEach(c => {
        caps.push(c);
      });
      this.setState(
        {
          caps: caps,
          capstones: caps,
        });
    });

    // get all departments from strapi
    axios.get("/departments").then(res => {
      const depts = [];
      res.data.forEach(d => {
        depts.push(d);
      });
      this.setState(
        {
          depts: depts,
        });
    })

    // get all sponsors from strapi
    axios.get("/sponsors").then(res => {
      const spons = [];
      res.data.forEach(s => {
        spons.push(s);
      });
      this.setState(
        {
          spons: spons,
        });
    })

    // get all tags from strapi
    axios.get("/tags").then(res => {
      const tags = [];
      res.data.forEach(t => {
        tags.push(t);
      });
      this.setState(
        {
          tags: tags,
        });
    })

    // get current user from strapi
    axios.get("/users/me").then(res => this.setState({myID: res.data}));

  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  // filter capstones by entered search field value
  liveSearch(event) {
    console.log("live searching for " + event.target.value);
    this.state.searchField = event.target.value;
    this.setState({searchField: event.target.value});
    console.log('here is the updated search state: ' + this.state.searchField);

    //now we want to filter capstones by this search criteria
    if (this.state.searchField === '') {
      console.log('searchField was empty... reset');
      this.filterReset();
    } else {
      this.filterCapstonesSearch();
    }
  }

  normalSearch(event) {
    console.log("normal searching for " + event.target.value);
  }

  // updates departments based on filter
  updateFilteredDepartments(event, value) {
    console.log("dialog search: ", value);
    this.setState({filteredDepartmentList: value});
  }

  // updates sponsors based on filter
  updateFilteredSponsors(event, value) {
    console.log("dialog search: ", value);
    this.setState({filteredSponsorList: value});
  }
  // updates tags based on filter
  updateFilteredTags(event, value) {
    console.log("dialog search: ", value);
    this.setState({filteredTagList: value});
  }

  // This is called when search button in dialog filter box is clicked
  filterCapstones() {
    console.log("current capstones", this.state.capstones);
    console.log("filtered departments", this.state.filteredDepartmentList);
    console.log("filtered sponsors", this.state.filteredSponsorList);
    console.log("filtered tags", this.state.filteredTagList);

    let tempFilteredCapstones = [];

    // first filter capstones by selected departments if any
    if (this.state.filteredDepartmentList.length > 0) {
      for (let i = 0; i < this.state.caps.length; i++) {
        for (let k = 0; k < this.state.filteredDepartmentList.length; k++) {
          if (this.state.filteredDepartmentList[k].name === this.state.caps[i].department.name) {
            tempFilteredCapstones.push(this.state.caps[i]);
          }
        }
      }
    } else {
      tempFilteredCapstones = this.state.caps.slice();
    }

    // second filter current capstones by selected sponsors if any
    if (this.state.filteredSponsorList.length > 0) {
      let tempAfterSponsorFilterCapstones = [];
      for (let i = 0; i < tempFilteredCapstones.length; i++) {
        for (let k = 0; k < this.state.filteredSponsorList.length; k++) {
          if (tempFilteredCapstones[i].sponsors.some(sponsor => sponsor._id === this.state.filteredSponsorList[k]._id)
              && !tempAfterSponsorFilterCapstones.includes(tempFilteredCapstones[i])) {
            tempAfterSponsorFilterCapstones.push(tempFilteredCapstones[i]);
          }
        }
      }
      tempFilteredCapstones = tempAfterSponsorFilterCapstones.slice();
    }

    // third filter current capstones by selected tags if any
    if (this.state.filteredTagList.length > 0) {
      let tempAfterTagFilterCapstones = [];
      for (let i = 0; i < tempFilteredCapstones.length; i++) {
        for (let k = 0; k < this.state.filteredTagList.length; k++) {
          if (tempFilteredCapstones[i].tags.some(tag => tag._id === this.state.filteredTagList[k]._id)
            && !tempAfterTagFilterCapstones.includes(tempFilteredCapstones[i])) {
            tempAfterTagFilterCapstones.push(tempFilteredCapstones[i]);
          }
        }
      }
      tempFilteredCapstones = tempAfterTagFilterCapstones.slice();
    }

    this.state.capstones = tempFilteredCapstones;
    this.setState({capstones: tempFilteredCapstones});
  }

  // we are going to update our capstones list based on search and filter
  filterCapstonesSearch() {
    let approvedCapstones = [];
    console.log('here are all of the capstones we are going to filter from');
    console.log(this.state.caps);

    // we want to apply the filtering to our capstone list
    this.filterCapstones();
    console.log('AFTER FILTER');
    console.log(this.state.capstones);

    // now we want to make sure all of our capstones contain the searchField string
    for (const currentCapstone of this.state.capstones) {
      console.log('im going to see if capstone: ' + currentCapstone.CapstoneName + ' is part of searchField: ' + this.state.searchField);
      if ((String(currentCapstone.CapstoneName).toLowerCase()).includes((String(this.state.searchField)).toLowerCase())) {
        console.log('search success!');
        approvedCapstones.push(currentCapstone);
      }
    }

    this.setState({capstones: approvedCapstones});
  }

  // this will clear all filters and display the default
  filterReset() {
    // this.initDepartments();
    console.log("this.state.caps", this.state.caps);
    this.state.searchField = '';
    this.setState({
      searchField: '',
      capstones: this.state.caps,
      filteredDepartmentList: [],
      filteredSponsorList: [],
      filteredTagList: []
    });

    console.log("capstones after reset", this.state.capstones);
  }

  handleClickOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.filterCapstones();
    this.setState({open: false});
  };

  handleListItemClick = value => {
    this.setState({onClose: value});
  };

  // check if usr has ability to edit capstone
  checkCanEdit(card){
    console.log(card);
    console.log(this.state.myID)
    for(let i =0;i<card.creators.length;i++){
      if(card.creators[i]._id === this.state.myID._id){
        return (<Button
          size="small"
          color="primary"
          component={Link}
          to={"/capstones/edit/" + card['_id']}
        >
          Edit
        </Button>);
      }
    }
  }

  render() {

    const {classes} = this.props;

    return (
      <React.Fragment>
        <Parallax bgImage={"/assets/snow-top-mountain-under-clear-sky-1054218.jpg"} strength={500}
                  className={classes.page}>
          <div style={{height: '100vh'}}>
            <div style={surroundStyle}>
              <Typography className={classes.typography}>
                <Box fontWeight="fontWeightLight" letterSpacing={20} textAlign="center">
                  CAPSTONES
                </Box>
              </Typography>
            </div>
          </div>
        </Parallax>

        <Grid container
              direction="row"
              justify="center"
              alignItems="center">
          <Grid item container justify="center" className={classes.filterPadding}>
            <form onSubmit={this.normalSearch}>
              <TextField value={this.state.searchField} id={"standard-basic"} label={"Search for Capstone..."} onChange={this.liveSearch}/>
            </form>
          </Grid>
          <Grid item container justify="center" className={classes.filterPadding}>
            <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
              Filter Capstones
            </Button>
            <Dialog
              open={this.state.open}
              onClose={this.handleClose}
              aria-labelledby="filter-dialog"
              aria-describedby="filter-options"
            >
              <DialogTitle id="filter-title">{"Filter Capstones"}</DialogTitle>
              <DialogContent>
                <Autocomplete
                  multiple
                  id="department-filter"
                  size="small"
                  options={this.state.depts}
                  getOptionLabel={option => option.name}
                  value={this.state.filteredDepartmentList ? this.state.filteredDepartmentList : ''}
                  onChange={this.updateFilteredDepartments}
                  renderInput={params => (
                    <TextField {...params} variant="standard" label="Department" placeholder="Choose..."/>
                  )}
                />
                <Autocomplete
                  multiple
                  id="sponsor-filter"
                  size="small"
                  options={this.state.spons}
                  getOptionLabel={option => option.name}
                  value={this.state.filteredSponsorList ? this.state.filteredSponsorList : ''}
                  onChange={this.updateFilteredSponsors}
                  renderInput={params => (
                    <TextField {...params} variant="standard" label="Sponsor" placeholder="Choose..."/>
                  )}
                />
                <Autocomplete
                  multiple
                  id="tag-filter"
                  size="small"
                  options={this.state.tags}
                  getOptionLabel={option=>option.Name}
                  value={this.state.filteredTagList ? this.state.filteredTagList : ''}
                  onChange={this.updateFilteredTags}
                  renderInput={params => (
                    <TextField {...params} variant="standard" label="Tag" placeholder="Choose..."/>
                  )}
                  />
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                  Search
                </Button>
              </DialogActions>
            </Dialog>
            <Button variant="contained" color="primary" onClick={this.filterReset}>Clear Search</Button>
          </Grid>
        </Grid>

        <Grid container className={classes.valueGrid}>
          <Container maxWidth="lg">

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
                      {this.checkCanEdit(card)}
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
)(Capstone);


