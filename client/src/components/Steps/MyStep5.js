/**
 * File: MyStep5.js
 * Author: Garth Terlizzi
 * This is the last step of the capstone creator form
 */
import Fade from "react-reveal/Fade";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Paper from "@material-ui/core/Paper";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";

export default class MyStep5 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {form: props.form};
  }

  render() {
    if (this.state.form.state.currentStep !== 4 && this.state.form.props.type !== "edit") {
      return null
    }
    return (
      <div className="form-group" style={{paddingLeft: '30px', paddingRight: '30px'}}>
        <Fade right={this.state.form.state.direction}>

          <Grid item xs={12} style={{maxHeight: "500px"}}>
            <Paper>
              <Typography component="h2" variant="h6" color="primary" gutterBottom>Add Photos</Typography>
              <div className={this.state.form.props.classes.galleryRoot}>
                <GridList className={this.state.form.props.classes.galleryGridList}>
                  {this.state.form.state.pictures.map(tile => (
                    <GridListTile className={this.state.form.props.classes.galleryTile} key={tile}
                                  style={{maxHeight: "200px", maxWidth: "200px"}}>
                      <img src={tile} alt={tile}/>
                      <GridListTileBar
                        titlePosition="top"
                        actionIcon={
                          <IconButton className={this.state.form.props.classes.icon}
                                      onClick={this.state.form.deleteImage({tile})}>
                            <Delete style={{color: "red"}}/>
                          </IconButton>
                        }/>
                    </GridListTile>
                  ))}
                  <GridListTile className={this.state.form.props.classes.galleryTile} key={"add"}
                                style={{maxHeight: "200px", maxWidth: "200px"}}>
                    <div>
                      <label htmlFor="upload-button">
                        <img src={require('./addImage.png')} alt={"addImage"}/>
                      </label>
                      <input type="file" id="upload-button" style={{display: 'none'}}
                             onChange={this.state.form.handleImageUpload}/>
                    </div>
                  </GridListTile>
                </GridList>
              </div>
            </Paper>
          </Grid>
        </Fade>
      </div>
    );
  }
}


