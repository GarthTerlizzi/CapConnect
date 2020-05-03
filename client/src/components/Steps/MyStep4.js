/**
 * File: MyStep4.js
 * Author: Garth Terlizzi
 * This is the fourth step of the capstone creator form
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
import TextField from "@material-ui/core/TextField";

export default class MyStep4 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {form: props.form};
  }

  render() {
    if (this.state.form.state.currentStep !== 3 && this.state.form.props.type !== "edit") {
      return null
    }
    return (
      <div className="form-group" style={{paddingLeft: '30px', paddingRight: '30px'}}>
        <Fade right={this.state.form.state.direction}>

          <Grid container style={{justifyContent: "center"}}>
              <Typography style={{marginTop: '2.5%'}} variant="h7">
                Add or Remove Participants
              </Typography>
          </Grid>
          <Grid container style={{justifyContent: "center"}}>
            <Grid xs={3} style={{flexGrow: "1",maxWidth:"50%"}}>
              <form className={this.state.form.props.classesContainer} noValidate autoComplete="off" style={{display:"flex"}}>
                <TextField
                  style={{minWidth: "100%"}}
                  id="standard-name"
                  placeholder="Search by Username or Name"
                  className={this.state.form.props.classTextField}
                  value={this.state.form.state.input}
                  onChange={this.state.form.handleSearchChange('input')}
                  margin="normal"
                  onKeyDown={this.state.form.props.onKeyDown}
                  InputProps={this.state.form.props.InputProps}
                />
              </form>
            </Grid>
            <List dense className={this.state.form.props.classList} style={{width: "100%"}} subheader={<li/>}>
              <Scrollable>
                {this.state.form.state.Users.map((value, i) => (
                  <Typography variant="subtitle2" style={{marginTop: '1%'}}>
                    <ListItem key={value}>
                      <ListItemText primary={this.state.form.checkValue(value)}/>
                      <ListItemSecondaryAction>
                        <Checkbox
                          checked={this.state.form.state.Participants.includes(value)}
                          onChange={this.state.form.handleParticipantToggle(value)}
                          disabled={this.state.form.disableCheckBox(value)}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                    <Divider/>
                  </Typography>
                ))}
              </Scrollable>

            </List>
          </Grid>
        </Fade>
      </div>
    );
  }
}


