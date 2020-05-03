import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import withWidth from "@material-ui/core/withWidth";
import {compose} from "recompose";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import {Parallax} from "react-parallax";
import {Card} from "@material-ui/core";
import Skeleton from "react-loading-skeleton";
import axios from "axios";

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
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
  img: {
    verticalAlign: 'center',
    maxWidth: '100%',
    maxHeight: 'auto',
  },
});

class SimplePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      bgImage: '',
      textHeader: '',
      text: '',
      displayImage: '',
    };
  }

  async componentDidMount() {
    let data = await this.getPageInfo();
    document.title = data.NavDisplayText + " | CapConnect";
    this.setState({
      title: data.PageInfo.Title,
      bgImage: data.PageInfo.BackgroundImage,
      textHeader: data.PageInfo.TextboxTitle,
      text: data.PageInfo.Text,
      displayImage: data.PageInfo.DisplayImage
    });

    //pulls background image from strapi if available
    if(this.state.bgImage !== null){
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
          this.setState({ bgImage: "data:;base64," + base64 });
        }
      );
    }

    //pulls display image from strapi if available. In strapi, this is a required field, but someone might change that.
    if(this.state.displayImage !== null){
      axios.get(
        this.state.displayImage["url"],
        {responseType: "arraybuffer"},
      ).then(
        response => {
          const base64 = btoa(
            new Uint8Array(response.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              '',
            ),
          );
          this.setState({ displayImage: "data:;base64," + base64 });
        }
      );
    }
  }

  async getPageInfo() {
    //get all pages
    let url = '/basic-pages/';
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
              <Grid container spacing={1} direction="row" justify="space-evenly" alignItems="center">
                {/*text*/}
                <Grid item xs={6}>
                  <Paper className={classes.textBox} elevation={1}>
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
                </Grid>
                {/*image*/}
                <Grid item xs={6}>
                  {
                    this.state.displayImage ?
                      <img className={classes.img} alt="Unable to load image" src={this.state.displayImage}/>
                      :
                      <Skeleton circle={true} height={400} width={400}/>
                  }
                </Grid>
              </Grid>
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
)(SimplePage);
