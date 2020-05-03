/*
Filename: ViewUser.js
Previous Contributors:
Stephen Tate - Styled page and added about half of the functionality
Greg Keeton - Implemented editing functionality and conditional rendering of page objects
Ryan Cave - minor bug fixes after ViewCapstone routing change.

Current Contributors:
Cameron Cole
 */

import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Fab,
  FormControl,
  Grid, Input,
  InputLabel,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import axios from 'axios';

import LoadingCircle from "./components/LoadingCircle";
import SubHeadingTextTypography from "./components/SubHeadingTextTypography";
import PageTitleTypography from "./components/PageTitleTypography";
import {withHelmet} from "../components/HelmetProvider";
import {withAuth0} from "../react-auth0-spa";

const styles = theme => ({
  card: {
    raised: true,
  },
  associatedCard: {
    raised: true,
    height: '200px',
    overflow: 'auto',
  },
  button: {
    color: 'primary',
  },
  media: {
    maxWidth: 400,
    borderRadius: '25px',
  },
  primaryButton: {
    color: 'primary',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 18,
  },
  pos: {
    marginBottom: 100,
  },
  center: {
    display: 'block',
    width: '50%',
  }
});

class Account extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      loading: true,
      user: undefined,
      open: false,
      Bio: '',
      Department: '',
      ProfilePictureURL: '',
      FullName: '',
      oldBio: '',
      oldDepartment: '',
      oldFullName: '',
      editable: true,
      departmentList: [],
      hasPicture: false,
      image: '',
      imageName: ''
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillUnmount() {
    this.props.helmet.setPage(undefined);
  }

  static handleCapstoneClick(capstoneName) {
    window.location = '/ViewCapstone/' + capstoneName;
  }

  handleOpen(e, open, post) {
    this.setState({
      [open]: true,

      // Persist state for making edits to individual posts
      oldBio: post['Bio'],
      oldDepartment: post['Department'],
      oldFullName: post['FullName'],
      Bio: post['Bio'],
      Department: post['Department'],
      FullName: post['FullName']
    });
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });

    if (name === "Picture") {
      this.setState({hasPicture: true, ProfilePictureURL: URL.createObjectURL(event.target.files[0])});
      console.log(event.target.value);
    }
  };

  async handleSubmit() {
    this.handleClose();
    let newImageId = null;
    let {user} = this.state;
    let dept = "";

    // Make the changes
    //alert(JSON.stringify(this.state.user));

    // Match the Department name to the id for putting
    this.state.departmentList.forEach(element => {
      if (element.name === this.state.Department) {
        this.state.Department = element._id;
      }
    });

    let hash = 'none';
    if (this.state.hasPicture) {
      // Upload image and link it to profile
      // Upload image and link it to profile
      console.log("posting");
      let formData = new FormData();
      let blob = await fetch(this.state.ProfilePictureURL).then(r => r.blob());
      formData.set("files", blob, "profile.jpeg");

      await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      }).then(async res=> {
        console.log(res);
        await axios.put("/users/" + this.state.user._id, {
          Bio: this.state.Bio,
          Department: this.state.Department,
          FullName: this.state.FullName,
          ProfilePictureURL: res.data[0].url
        });
        console.log('done');
        }
      ).catch(function (err) {
        console.log('Upload failed');
        console.log(err);
      });
    }else{
      await axios.put("/users/" + this.state.user._id, {
        Bio: this.state.Bio,
        Department: this.state.Department,
        FullName: this.state.FullName,
      });
    }



    window.location.reload(true);
  }

  async componentDidMount() {
    this.props.helmet.setPage("Account");

    //let user = this.props.auth0.user.nickname;
    const posts2 = await axios.get('/users');
    const depts = await axios.get("/departments").then(res => {
      this.state.departmentList = res.data;
    });
    this.setState({ProfilePictureURL: '/assets/default-user-profile-image-png-6.png'});

    this.setState({
      loading: false,
      users: posts2
    });

    if (!this.state.user &&  axios.defaults.headers.common["Authorization"]) {
      await axios.get("/users/me").then(res => this.setState({user: res.data}));
    }
    if(this.state.user.ProfilePictureURL !== "none"){
      try {
        let blob = await fetch(this.state.user.ProfilePictureURL).then(r => r.blob());
        let blobURL = URL.createObjectURL(blob);
        this.setState({ProfilePictureURL: blobURL})
      }catch(err){
        console.log(err);
      }
    }
  }

  render() {


    const {classes} = this.props;

    if (this.state.user) {

      // Get proper department name to display
      this.state.departmentList.forEach(element => {
        if (element._id === this.state.user.Department) {
          this.state.oldDepartment = element.name;
        }
      });

      let userCapstones = [];
      let caps_test = 'Createdcapstones';

      if (this.state.user['CreatedCapstones'] === undefined) {

      } else {
        let caps = this.state.user[caps_test];
        console.log(caps);
        if (caps !== undefined) {
          for (caps in this.state.user[caps_test]) {
            userCapstones.push(this.state.user[caps_test][caps]);
          }
        }
      }

      let picArray = [this.state.ProfilePictureURL];

      return (
        <div>
          <Grid container layout={'row'} justify="center">
            <Grid item xs={12} md={10}>
              {this.state.editable === true ?
                <h1><b>Your Profile</b></h1>
                : null
              }
              {this.state.editable === false ?
                <h1><b>User Profile</b></h1>
                : null
              }
              <Divider/>
            </Grid>
          </Grid>


          <Grid container layout={'row'} justify="center" spacing={24}>
            <Grid item xs={12} md={10}>
              <Card className={classes.card} style={{marginTop: '1%'}}>
                <CardContent>
                  <PageTitleTypography text={this.state.user['FullName']} align="left"/>
                  <Typography variant="subtitle1">
                    Username: {this.props.auth0.user.nickname}
                  </Typography>
                  <Divider/>
                  <Grid item xs={12} md={10}>
                    {this.state.editable === true ?
                      <Button onClick={(e) =>
                        this.handleOpen(e, 'open', this.state.user)}
                              variant="outlined" color="primary" size="small"
                              style={{marginTop: '1%'}}>
                        Edit Profile
                      </Button>
                      : null
                    }

                    <Button onClick={() => this.props.auth0.logout()} variant="outlined" color="primary"
                            size="small" style={{marginTop: '1%'}}>Logout</Button>

                    <Dialog
                      open={this.state.open}
                      onClose={(e) => this.handleClose(e)}
                    >
                      <DialogTitle id="edit-profile">Edit Profile</DialogTitle>
                      <DialogContent>
                        <Typography>
                          <TextField
                            id="biography"
                            label="About Me"
                            multiline
                            rows="10"
                            margin="dense"
                            variant="outlined"
                            style={{width: 500}}
                            onChange={this.handleChange('Bio')}
                            defaultValue={this.state.oldBio}
                          />
                        </Typography>
                        <FormControl variant="outlined" className={classes.formMargin}>
                          <InputLabel>
                            Department
                          </InputLabel>
                          <Select
                            native
                            style={{width: 500}}
                            value={this.state.Department}
                            onChange={this.handleChange('Department')}
                            input={
                              <OutlinedInput
                                name="Department"
                                labelWidth={85}
                              />
                            }
                          >
                            <option value={""}></option>
                            {this.state.departmentList.map(dept => (
                              <option value={dept.name}>{dept.name}</option>
                            ))}
                          </Select>
                        </FormControl>
                        <Typography>
                          <TextField
                            id="fullname"
                            label="Full Name"
                            margin="dense"
                            variant="outlined"
                            style={{width: 500}}
                            onChange={this.handleChange('FullName')}
                            defaultValue={this.state.oldFullName}
                          />
                        </Typography>
                        <Typography component="h1" align="center">
                          Upload a file
                        </Typography>
                        <form>
                          <Typography align="center">
                            Browse...
                            <Input
                              type="file"
                              id="file-id"
                              name="file"
                              accept="image/*"
                              onChange={this.handleChange('Picture')}
                            />
                          </Typography>
                        </form>
                      </DialogContent>
                      <DialogActions>
                        <Fab variant="extended" onClick={this.handleSubmit} color="primary">
                          Update
                        </Fab>
                      </DialogActions>
                    </Dialog>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <div>
            <Grid container layout={'row'} justify="center" spacing={24}>
              <Grid item xs={12} md={2}>
                <Card className={classes.card} style={{paddingBottom: '12px', height: '100%'}}>
                  <CardHeader
                    title="Profile Picture"
                  >
                  </CardHeader>
                  <Divider/>
                  <Grid container justify="center">
                    {
                      picArray.map((result) => (
                        <img src={result} alt="profile"
                             style={{
                               borderRadius: '12px',
                               marginTop: '12px', width: '500px', height: '230px'
                             }}></img>

                      ))}

                  </Grid>

                </Card>
              </Grid>
              <Grid item xs={12} md={8}>
                <Card className={classes.card} style={{height: '100%'}}>
                  <CardHeader
                    title="Profile Details"
                  >
                  </CardHeader>
                  <Divider/>
                  <div style={{paddingLeft: '16px', paddingTop: '8px'}}>
                    <Typography variant="subtitle1" color="textPrimary">
                      <b>Email:<br/></b>
                      {this.props.auth0.user.email}
                    </Typography>
                  </div>
                  <div style={{paddingLeft: '16px', paddingTop: '8px'}}>
                    <Typography variant="subtitle1" color="textPrimary">
                      <b>Department:<br/></b>
                      {this.state.oldDepartment}
                    </Typography>
                  </div>
                  <br/>
                  <div style={{paddingLeft: '16px', paddingTop: '16px'}}>
                    <Typography variant="subtitle1" color="textPrimary">
                      <b>About Me:<br/></b>
                      {this.state.user['Bio']}
                    </Typography>
                  </div>
                </Card>
              </Grid>
            </Grid>
          </div>

          <div>
            <Grid container justify="center" spacing={24}>
              <Grid item xs={12} md={10}>
                <Card>
                  <CardHeader
                    title="Associated Capstones"
                  />
                  <Divider/>
                  <br/>
                </Card>
              </Grid>
            </Grid>
          </div>
          <Grid container justify="center">
            <Grid item xs={12} md={10}>
              <Grid container spacing={8}>
                {userCapstones.map((result) => (
                  <Grid item xs={12} md={6} style={{marginTop: '1%'}}>
                    <Card className={classes.associatedCard}
                          onClick={(e) => Account.handleCapstoneClick(result["_id"])}>
                      <CardContent>
                        <SubHeadingTextTypography text={result["CapstoneName"]}/>
                        <Divider/>
                        <Typography variant="body2">
                          {result["Description"]}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </div>
      )
    } else {
      return (<div>
        < LoadingCircle/>
      </div>);
    }
  }
}

Account
  .propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withAuth0(withHelmet(withStyles(styles)(Account)));
