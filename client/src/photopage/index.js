import React from 'react';
import {compose} from "recompose";
import {Parallax} from "react-parallax";
import Skeleton from "react-loading-skeleton";
import axios from "axios";
import Carousel from 'react-material-ui-carousel'
import {FormControlLabel, Checkbox, withStyles, withWidth, Typography, Paper, Container, Card} from "@material-ui/core";

const useStyles = theme => ({
  page: {
    minHeight: "100%",
    minWidth: "100%",
    alignContent: "center"
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    height: '75vh',
  },
  paper: {
    borderRadius: 40,
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'hidden',
    flexDirection: 'column',
    alignItems: 'center',
    height: 'auto',
  },
  textBox: {
    verticalAlign: 'center',
    maxWidth: '100%',
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  img: {
    verticalAlign: 'right',
    height: '50vh',
  },
});

class PhotoPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      bgImage: '',
      textHeader: '',
      text: '',
      displayImages: '',
      autoPlay: true,
    };
  }

  toggleAutoPlay() {
    this.setState({
      autoPlay: !this.state.autoPlay
    })
  }

  async componentDidMount() {
    let data = await this.getPageInfo();
    document.title = data.NavDisplayText + " | CapConnect";
    this.setState({
      title: data.PageInfo.Title,
      bgImage: data.PageInfo.BackgroundImage,
      textHeader: data.PageInfo.TextboxTitle,
      text: data.PageInfo.Text,
    });

    let rawImages = data.PageInfo.Images;

    if (this.state.bgImage !== null) {
      axios.get(
        this.state.bgImage["url"],
        {responseType: "arraybuffer"},
      ).then(
        response => {
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          );
          this.setState({bgImage: "data:;base64," + base64});
        }
      );
    }
    if (rawImages !== null) {
      let images = [];
      for (let i = 0; i < rawImages.length; i++) {
        axios.get(
          rawImages[i]["url"],
          {responseType: "arraybuffer"},
        ).then(
          response => {
            const base64 = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );
            images.push("data:;base64," + base64);
            this.setState({displayImages: images});
          }
        );
      }
    }
  }

  async getPageInfo() {
    //get all pages
    let url = '/photo-pages/';
    let pageData = await axios.get(url)
      .then(function (response) {
        return response.data;
      });

    //get last part of url
    let path = window.location.href.split('/');
    path = path[path.length - 1];

    //compare last part of url to url in strapi to get the id of the correct page
    for (let i = 0; i < pageData.length; i++) {
      if (pageData[i]["URL"] === path) {
        return pageData[i];
      }
    }
  }

  render() {
    const {classes} = this.props;
    return <Parallax bgImage={this.state.bgImage} strength={1000} className={classes.page}>
      <div className="App">
        <main className={classes.content}>
          <div className={classes.appBarSpacer}/>
          <Container maxWidth="lg" className={classes.container}>
            <Card className={classes.paper}>
              {
                this.state.title ?
                  <Typography component="h1" variant="h2" color="primary" gutterBottom>{this.state.title}</Typography>
                  :
                  <Skeleton count={1} width={500} height={75}/>
              }
              {/*image carousel*/}
              {
                this.state.displayImages ?
                  <Carousel autoPlay={this.state.autoPlay} interval={"7000"} animation={"slide"}>
                    {this.state.displayImages.map(image =>
                      <img className={classes.img} alt="Unable to load image" src={image}/>
                    )}
                  </Carousel>
                  :
                  <Skeleton variant="rect" height={'50vh'} width={'75vh'}/>
              }
              {/*toggle auto scroll carousel on/off*/}
              <FormControlLabel
                control={
                  <Checkbox onChange={() => this.toggleAutoPlay()} defaultChecked={this.state.autoPlay} color="primary"/>
                } label="Auto-Play"
              />
              {/*text*/}
              <Paper className={classes.textBox} elevation={0} width={1}>
                {
                  this.state.textHeader && this.state.text ?
                    <div>
                      <p style={{textAlign: 'center'}}><b>{this.state.textHeader}</b></p>
                      <p style={{textAlign: 'left'}}>{this.state.text}</p>
                    </div>
                    :
                    <div>
                      <p><Skeleton count={7}/></p>
                    </div>
                }
              </Paper>
            </Card>
          </Container>
        </main>
      </div>
    </Parallax>
  }
}

export default compose(
  withStyles(useStyles),
  withWidth(),
)(PhotoPage);
