/**
 * File: MyStep3.js
 * Author: Garth Terlizzi
 * This is the third step of the capstone creator form
 * Note: it is currently being left out of the final project
 */
import Fade from "react-reveal/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Scrollable from "hide-scrollbar-react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";

export default class MyStep3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {form: props.form};
  }

  render() {
    if (this.state.form.state.currentStep !== 3 && this.state.form.props.type !== "edit") {
      return null;
    }
    return (
      <div className="form-group" style={{paddingLeft: '30px', paddingRight: '30px'}}>
        <Fade right={this.state.form.state.direction}>
          <Grid item xs={12}>
            <Typography variant="subheading" style={{marginTop: '2.5%'}}>
              Select Your Sponsors
            </Typography>
            <Divider/>
            <List dense className={this.state.form.props.classList} subheader={<li/>}>
              <Scrollable>
                {/*Scrollable list of sponsors*/}
                {this.state.form.state.sponsorList.map(value => (
                  <ListItem key={value} button>
                    <ListItemText primary={value.name}/>
                    <ListItemSecondaryAction>
                      <Checkbox
                        checked={this.state.form.state.checkedSponsors.includes(value)}
                        onChange={this.state.form.handleSponsorToggle(value)}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </Scrollable>
            </List>
            <Divider/>
          </Grid>
        </Fade>
      </div>
    );
  }
}


