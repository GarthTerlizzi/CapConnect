/**
 * File: MyStep1.js
 * Author: Garth Terlizzi
 * This is the first step of the capstone creator form
 */

import Fade from "react-reveal/Fade";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import React from "react";

export default class MyStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {form: props.form, className: props.className};
  }

  render() {
    if (this.state.form.state.currentStep !== 1 && this.state.form.props.type !== "edit") {
      return null;
    }

    return (
      <div className="form-group" style={{paddingLeft: '30px', paddingRight: '30px'}}>
        <Fade right={this.state.form.state.direction}>
          <Grid container spacing={2} style={{paddingLeft: "20px"}}>
            <Grid item xs={12} sm={6}>
              <FormControl margin="dense" required fullWidth={true}>
                <InputLabel htmlFor="Capstone Name">Capstone Name</InputLabel>
                <Input
                  id="cap-name"
                  name="cap-name"
                  autoComplete="cap-name"
                  autoFocus
                  error={this.state.form.state.errors[0] || this.state.form.state.errors[1]}
                  value={this.state.form.state.CapstoneName}
                  onChange={this.state.form.handleChange('CapstoneName')}
                  onBlur={this.state.form.handleBlur('CapstoneName')}
                />
              </FormControl>
              <InputLabel htmlFor="Capstone Name"
                          style={{color: "red"}}>{this.state.form.nameError(this.state.form)}</InputLabel>
            </Grid>
            <Grid item xs={12} sm={6} alignContent="center"
                  style={{paddingTop: '30px', justifyContent: "center"}}>
              <Typography align={"center"}>Pick a name for your Capstone.</Typography>
            </Grid>

            <Grid item xs={12} sm={6} style={{paddingTop: '25px'}}>
              <form className={this.state.form.props.className} noValidate>
                <TextField
                  id="date"
                  label="Start Date"
                  type="date"
                  defaultValue={this.state.form.state.StartDate}
                  className={"container"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{width: "100%"}}
                  value={this.state.form.state.StartDate}
                  onChange={(event) => this.state.form.setState({StartDate: event.target.value})}
                  onBlur={this.state.form.handleBlur('Date')}
                  error={this.state.form.state.errors[2]}
                />
                <InputLabel htmlFor="Start Date"
                            style={{color: "red"}}>{" "}{this.state.form.dateError(this.state.form)}</InputLabel>
              </form>

            </Grid><Grid item xs={12} sm={6} alignContent="center"
                         style={{paddingTop: '30px', justifyContent: "center"}}>
            <Typography align={"center"}>Pick a start date for your Capstone.</Typography>
          </Grid>
            <Grid item xs={12} sm={6} style={{paddingTop: '25px'}}>
              <form className={this.state.className} noValidate>
                <TextField
                  id="date2"
                  label="End Date"
                  type="date"
                  defaultValue={this.state.form.state.EndDate}
                  className={"container"}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  style={{width: "100%"}}
                  value={this.state.form.state.EndDate}
                  onChange={(event) => this.state.form.setState({EndDate: event.target.value})}
                  onBlur={this.state.form.handleBlur('Date')}
                  error={this.state.form.state.errors[2]}
                />
              </form>
              <InputLabel htmlFor="End Date"
                          style={{color: "red"}}> {" "}{this.state.form.dateError(this.state.form)}</InputLabel>
            </Grid>
            <Grid item xs={12} sm={6} alignContent="center"
                  style={{paddingTop: '30px', justifyContent: "center"}}>
              <Typography align={"center"}>Pick an end date for your Capstone.</Typography>
            </Grid>
          </Grid>
        </Fade>
      </div>
    );
  }
}

