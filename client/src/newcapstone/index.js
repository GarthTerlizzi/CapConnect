import React, {Component} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import withWidth from "@material-ui/core/withWidth/withWidth";
import compose from 'recompose/compose';
import {CardHeader} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CapstoneCreatorForm from "../components/CapstoneCreatorForm/CapstoneCreatorForm";
import {withHelmet} from "../components/HelmetProvider";

var bg = require('../components/CapstoneCreatorForm/ccbackground.jpeg');

const styles = theme => ({
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overfnlow: 'auto',
    maxHeight: '300px',
  },

  card: {
    marginTop: '10%',
  },
  leftColCard: {
    marginRight: '2%',
    marginTop: '1%',
  },
  formMargin: {
    marginTop: '.5%',
  },
  textField: {
    marginLeft: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    width: 250,
    placeholder: "Search..."
  },
  body: {
    paddingBottom: "0px"
  },
});

class NewCapstone extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.helmet.setPage("Create a Capstone");
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  render() {
    return <React.Fragment>
      <body className='background-image'
            style={{backgroundImage: "url(" + bg + ")", height: "100vh", minWidth: "100%",backgroundSize: "cover"}}>
      {/*Page header*/}
      <div>
        <Grid container justify="center">
          <Grid item xs={10} md={8} style={{paddingTop:"100px"}}>
            <Card style={{opacity: "85%"}}>
              <CardHeader style={{paddingTop:"50px"}}/>
              <Typography align={"center"}>Create a Capstone</Typography>
              <CardContent div>
                <Grid container justify={"center"}>
                  <Grid item xs={12}>
                    {/*Form input field for start date*/}
                    <CapstoneCreatorForm
                      classes={styles}
                      className={styles.formMargin}
                      classList={styles.list}
                      classesContainer={styles.container}
                      classTextField={styles.textField}
                      InputProps={{
                        className: styles.input
                      }}
                      type = {"create"}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
      </div>
      </body>
    </React.Fragment>
  }
}

export default withHelmet(NewCapstone);
