/**
 * File: MyStep2.js
 * Author: Garth Terlizzi
 * This is the second step of the capstone creator form
 */
import Fade from "react-reveal/Fade";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import React from "react";
import Select from "@material-ui/core/Select";
import ReactTags from 'react-tag-autocomplete';
import './Tags.css';
export default class MyStep2 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {form: props.form, className: props.className};

  }

  render() {
    if (this.state.form.state.currentStep !== 2 && this.state.form.props.type !== "edit") {
      return null;
    }
    return (
      <div className="form-group" style={{paddingLeft: '30px', paddingRight: '30px'}}>
        <Fade right={this.state.form.state.direction}>
          <Grid container spacing={2} style={{paddingLeft: "20px"}}>
            <Grid item xs={12} sm={6} justify={"flex-start"} >
              <FormControl className={this.state.form.props.className} style={{display: "flex"}}>
                <InputLabel>Department</InputLabel>
                <Select
                  style={{width: "100%" }}
                  native
                  value={this.state.form.state.Department}
                  onChange={this.state.form.handleChange('Department')}
                  autoWidth={true}
                >
                  <option value={""}></option>
                  {this.state.form.state.departmentList.map(dept => (
                    <option value={dept.name}>{dept.name}</option>
                  ))}

                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} alignContent="center"
                         style={{paddingTop: '30px', justifyContent: "center"}}>

            <Typography align={"center"}>Select the Department for your Capstone.</Typography>
          </Grid>

            <Grid item xs={12} sm={6} style={{paddingTop: '30px'}}>
              {/*Input field for the project description*/}
              <TextField
                label="Description"
                multiline
                rowsMax="20"
                defaultValue={this.state.form.state.Description}
                value={this.state.form.state.Description}
                onChange={this.state.form.handleChange('Description')}
                className={this.state.form.props.className}
                fullWidth={true}
                required={true}
                onBlur={this.state.form.handleBlur('Description')}
                error={this.state.form.state.errors[3]}
              >
              </TextField>
              <InputLabel htmlFor="Description"
                          style={{color: "red"}}>{" "}{this.state.form.descriptionError(this.state.form)}</InputLabel>
            </Grid>
            <Grid item xs={12} sm={6} alignContent="center"
                  style={{paddingTop: '30px', justifyContent: "center"}}>

              <Typography align={"center"}>Make a Description for your Capstone.</Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{paddingTop: '30px'}}>
              <Grid>
                <div id="ReactTags">
                  <ReactTags
                    tags={this.state.form.state.tags}
                    suggestions={this.state.form.state.suggestions}
                    handleDelete={this.state.form.handleDelete.bind(this.state.form)}
                    handleAddition={this.state.form.handleAddition.bind(this.state.form)}
                    handleTagClick={this.state.form.handleTagClick.bind(this.state.form)}
                    allowNew={true}
                  />
                </div>
              </Grid>

            </Grid>
            <Grid item xs={12} sm={6} alignContent="center"
                  style={{paddingTop: '30px', justifyContent: "center"}}>

              <Typography align={"center"}>Add tags to your capstone.</Typography>
            </Grid>
            <Grid item xs={12} sm={6} style={{paddingTop: '30px'}}>
              {/*Upload photo button*/}
              <Typography variant="subtitle2" style={{marginTop: '1%'}}>
                Upload Photo
              </Typography>
              <Input
                required
                type="file"
                id="file-id"
                name="file"
                accept="image/*"
                onChange={this.state.form.handleChange('DisplayPhoto')}
                fullWidth={true}
              />

            </Grid>
            <Grid item xs={12} sm={6} alignContent="center"
                  style={{paddingTop: '50px', justifyContent: "center"}}>
              <Typography align={"center"}>Upload a Photo.</Typography>
            </Grid></Grid>
        </Fade>
      </div>
    );
  }
}

