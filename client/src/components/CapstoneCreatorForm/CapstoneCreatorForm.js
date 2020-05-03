/**
 * File: CapstoneCreatorForm.js
 * Author: Garth Terlizzi
 * This is the multistep form where the user adds or edits the capstone
 * Step 3 has been removed
 */
import React from 'react';
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Filter from "bad-words";
import Fuse from "fuse.js";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import {makeStyles} from "@material-ui/core/styles";
import {Container} from "@material-ui/core";
import Scrollable from "hide-scrollbar-react";
import MyStep1 from "../Steps/MyStep1";
import MyStep2 from "../Steps/MyStep2";
import MyStep4 from "../Steps/MyStep4";
import MyStep5 from "../Steps/MyStep5";
import '../Steps/Tags.css';
import axios from "axios";
import history from "../../util/history";

class CapstoneCreatorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStep: 1,
      CapstoneName: '',
      StartDate: '',
      EndDate: '',
      Description: '',
      DisplayPhoto: '',
      Department: '',
      pictures: [],
      initialPictures: [],
      capstones: [],
      departmentList: [],
      sponsorList: [],
      checkedSponsors: [],
      AllUsers: [],
      AllTags: [],
      Users: [],
      Participants: [],
      cap_id: "",
      dept_id: "",
      my_id: "",
      direction: true,
      image: null,
      imageName: "",
      errorMessages: [
        'Profanity Detected. Choose a new name.',
        'Name already in use. Be creative.',
        'The End Date is Before the Start Date',
        'Please Enter A Description'],
      errors: [0, 0, 0, 0],
      tags: [
        {id: 1, name: "Capstone"},
      ], suggestions: [
        {id: 1, name: "Capstone"},
      ]
    };
  }

  async componentDidMount() {
    await this.initializeState();
    //If edit, match creators with api call by id
    //This is necessary because Strapi returns a creator without capstone attached
    if (this.props.type === "edit") {
      let caps = this.state.capstones;
      let spons = this.state.sponsorList;
      let myCreators = [];
      let myPics = [];

      let myCapstone = this.getCapstone(caps);
      let mySponsors = this.getSponsors(myCapstone);
      let myTags = this.getTags(myCapstone);
      let checkSpons = this.getCheckedSponsors(spons, myCapstone);

      this.setState({
        CapstoneName: myCapstone.CapstoneName,
        StartDate: myCapstone.StartDate.split('T')[0],
        EndDate: myCapstone.EndDate.split('T')[0],
        Description: myCapstone.Description,
        DisplayPhoto: myCapstone.DisplayPhoto,
        Department: myCapstone.department.name,
        checkedSponsors: checkSpons,
        dept_id: myCapstone.department._id,
        tags: myTags
      });

      myPics = myCapstone.Pictures;
      this.getPics(myPics);

      myCreators = myCapstone.creators;

      /*Push myself*/
      await axios.get('/users').then(response2 => {
        this.setState({Users: response2.data, AllUsers: response2.data});
        let myParticipants = this.state.Participants;
        for (let i = 0; i < response2.data.length; i++) {
          if (this.state.my_id === response2.data[i]._id) {
            myParticipants.push(response2.data[i]);
          } else {
            for (let j = 0; j < myCreators.length; j++) {
              if (response2.data[i]._id === myCreators[j]._id) {
                myParticipants.push(response2.data[i]);
              }
            }
          }
          this.setState({Participants: myParticipants});
        }
    });
    } else {
      /*Push myself*/
      await axios.get('/users').then(response2 => {
        this.setState({Users: response2.data, AllUsers: response2.data});
        let myParticipants = this.state.Participants;
          for (let i = 0; i < response2.data.length; i++) {
            if (this.state.my_id._id === response2.data[i]._id) {
              myParticipants.push(response2.data[i]);
              break;
            }
          }
          this.setState({Participants: myParticipants});
        });
    }
  }

  async initializeState(){
    //Initialize basic variables
    let caps = [];
    let depts = [];
    let spons = [];
    let suggests = [];

    //Prepare for pull from backend
    const requestOne = axios.get('/capstones');
    const requestTwo = axios.get('/departments');
    const requestThree = axios.get('/sponsors');
    const requestFour = axios.get('/tags');

    //Pull from backend
    await axios.all([requestOne, requestTwo, requestThree, requestFour]).then(axios.spread((...responses) => {
      console.log(responses);
      caps = responses[0].data;
      depts = responses[1].data;
      spons = responses[2].data;
      suggests = responses[3].data;
      // use/access the results
    })).catch(errors => { console.log("error")});

    //Get the id of the capstone
    let url = window.location.href;
    for (let i = url.length; i >= 0; i--) {
      if (url[i] === '/') {
        url = url.substring(i + 1, url.length);
        break;
      }
    }

    //Initialize tags
    let newSuggests = [];
    for (let i = 0; i < suggests.length; i++) {
      newSuggests.push({id: i, name: suggests[i].Name});
    }

    await axios.get('/users/me').then(res => {this.setState({my_id: res.data._id})});
    this.setState(
      {
        capstones: caps,
        departmentList: depts,
        sponsorList: spons,
        cap_id: url,
        AllTags: suggests,
        suggestions: newSuggests
      });
  }

  //Used to check if all errors are cleared before submitting
  isFormValid = () => {
    const {CapstoneName, Description, DisplayPhoto, checkedSponsors, Department} = this.state;
    for (let i = 0; i < this.state.errors.length; i++) {
      if (this.state.errors[i] === 1)
        return false;
    }
    return CapstoneName && Description && DisplayPhoto && Department;
  };

  //Used to handle changes in form states
  //Special Exemptions in Department and Photo
  handleChange = name => event => {
    this.setState({[name]: event.target.value});
    //Also store the ID of the department list
    if (name === "Department") {
      for (let i = 0; i < this.state.departmentList.length; i++) {
        if (this.state.departmentList[i].name === event.target.value) {
          this.setState({dept_id: this.state.departmentList[i]._id});
          break;
        }
      }
    }
    //Create a url for the photo
    if (name === "DisplayPhoto") {
      this.setState({image: URL.createObjectURL(event.target.files[0]), imageName: event.target.files[0].name});
    }
  };

  //Converts the image to a displayable format
  handleImageUpload = event => {
    if (event.target.files) {
      if (event.target.files.length != 0) {
        /* Get files in array form */
        const files = Array.from(event.target.files);
        let myImages = this.state.pictures;
        /* Map each file to a promise that resolves to an array of image URI's */
        Promise.all(files.map(file => {
          return (new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener('load', (ev) => {
              resolve(ev.target.result);
            });
            reader.addEventListener('error', reject);
            reader.readAsDataURL(file);
          }));
        }))
          .then(images => {
            /* Once all promises are resolved, update state with image URI array */
            myImages.push(images);
            this.setState({pictures: myImages})

          }, error => {
            console.error(error);
          });
      }
    }
  };

  //Handle form blur for handle validation
  handleBlur = name => event => {
    this.setState({[name]: event.target.value});
    let error = this.state.errors.slice(); //creates the clone of the state
    if (name === "CapstoneName") {
      //Check profanity
      let filter = new Filter();
      if (filter.isProfane(event.target.value)) {
        error[0] = 1;
      } else {
        error[0] = 0;
      }
      let validName = true;
      //Check if capstone name is unique
      for (let i = 0; i < this.state.capstones.length; i++) {
        if (this.state.capstones[i].CapstoneName.toUpperCase() === event.target.value.toUpperCase()) {
          if (this.state.capstones[i]._id !== this.state.cap_id) {
            error[1] = 1;
            validName = false;
            break;
          }
        }
      }
      if (validName) {
        error[1] = 0;
      }
      this.setState({errors: error});
    }

    if (name === "Department") {
      for (let i = 0; i < this.state.departmentList.length; i++) {
        if (this.state.departmentList[i].name === event.target.value) {
          this.setState({dept_id: this.state.departmentList[i]._id});
          break;
        }
      }
    }

    if (name === "Date") {
      if (this.state.StartDate !== '' && this.state.EndDate !== '') {
        if (new Date(this.state.StartDate) > new Date(this.state.EndDate)) {
          error[2] = 1;
        } else {
          error[2] = 0;
        }
      } else {
        error[2] = 0;
      }
      this.setState({errors: error});
    }

    if (name === "Description") {
      if (this.state.Department === "") {
        error[3] = 1;
      } else {
        error[3] = 0;
      }
      this.setState({errors: error});
    }
  };

  async placeTags(response) {
    const tags = [];
    for (let i = 0; i < this.state.tags.length; i++) {
      let found = false;
      for (let j = 0; j < this.state.suggestions.length; j++) {
        if (this.state.tags[i].name === this.state.suggestions[j].name) {
          found = true;
          break;
        }
      }
      if (found === false) {
        tags.push({Name: this.state.tags[i].name});
      }
    }
    let ids = [];
    for (let i = 0; i < tags.length; i++) {
      await axios.post('/tags', {Name: tags[i].Name}).then(r => ids.push(r.data._id)).catch(function (err) {
      });
    }

    for (let i = 0; i < this.state.AllTags.length; i++) {
      for (let j = 0; j < this.state.tags.length; j++) {
        if (this.state.AllTags[i].Name === this.state.tags[j].name) {
          ids.push(this.state.AllTags[i]._id);
        }
      }
    }
    await axios.put('/capstones/' + response.data._id, {tags: ids});
  }


  async handleSubmit() {
    if (this.state.DisplayPhoto == null) {
      return;
    }
    // get Sponsor IDs from Sponsor List
    const sponsorIDs = [];
    for (let i = 0; i < this.state.checkedSponsors.length; i++) {
      sponsorIDs.push(this.state.checkedSponsors[i]);
    }
    const UserIDs = [];
    for (let i = 0; i < this.state.Participants.length; i++) {
      UserIDs.push(this.state.Participants[i]);
    }
    UserIDs.push(this.state.my_id);
    let refId='';
    if (this.props.type === "create") {
      axios.post('/Capstones', {
        CapstoneName: this.state.CapstoneName,
        StartDate: this.state.StartDate,
        EndDate: this.state.EndDate,
        Description: this.state.Description,
        moderator: this.state.my_id,
        department: this.state.dept_id,
        creators: UserIDs,
        sponsors: sponsorIDs,
      }).then(async (response) => {
        await this.placeTags(response);
        refId = response.data['_id'];
        await this.upload(response, refId);
        for (let i = 0; i < this.state.pictures.length; i++) {
          let formData = new FormData();
          let blob = await fetch(this.state.pictures[i]).then(r => r.blob());
          formData.set("files", blob, this.state.image);
          formData.set("refId", refId);
          formData.set("ref", "capstone");
          formData.set("field", "Pictures");
          axios.post('/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          }).catch(function (err) {
            console.log('Upload failed');
            console.log(err);
          });
        }
      }).then(p => this.redirect(refId)).catch(function (error) {
        console.log("ERROR");
        console.log(error);
      });
    } else {
      await axios.put('/Capstones/' + this.state.cap_id, {
        CapstoneName: this.state.CapstoneName,
        StartDate: this.state.StartDate,
        EndDate: this.state.EndDate,
        Description: this.state.Description,
        department: this.state.dept_id,
        creators: UserIDs,
        sponsors: sponsorIDs,
        Pictures: []
      },).then(
        async (response) => {
          await this.placeTags(response);
          if (this.state.image !== null) {
            let refId = response.data['_id'];
            this.upload(response, refId);
          }
          let refId = response.data['_id'];
          for (let i = 0; i < this.state.pictures.length; i++) {
            let formData = new FormData();
            let blob = await fetch(this.state.pictures[i]).then(r => r.blob());
            formData.set("files", blob, this.state.image);
            formData.set("refId", refId);
            formData.set("ref", "capstone");
            formData.set("field", "Pictures");
            axios.post('/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).catch(function (err) {
              console.log('Upload failed');
              console.log(err);
            });
          }
        }).catch(function (error) {
        console.log("ERROR");
        console.log(error);
      });
      await this.awaitPost();
    }
  }

  //Redirects to view capstone once finished
  async redirect(id) {
    if(this.props.type === "create"){
      window.alert("Capstone Created!");
    }else{
      window.alert("Capstone Edited!");
    }
    history.replace('/#/capstones/' + id);
    history.go(0);
  }

  //Allows for search of user
  handleSearchChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });

    let phrase;
    let searchOptions = {
      shouldSort: true,
      threshold: 0.3,
      minMatchCharLength: 1,
      keys: ['FullName',
        'username',
      ]
    };

    if (this.state.input) {
      phrase = this.state.input;
    }

    if (phrase !== undefined) {
      let fuse = new Fuse(this.state.Users, searchOptions);
      this.setState({Users: fuse.search(phrase)})
    } else {
      this.setState({Users: this.state.AllUsers})
    }
  };

  //Used for Checkboxes
  handleParticipantToggle = value => () => {
    const {Participants} = this.state;
    const currentIndex = Participants.indexOf(value);
    const newChecked = this.state.Participants;
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({
      Participants: newChecked,
    });
  };

  checkValue(value) {
    if (value.FullName === "" || value.fullName === undefined) {
      return ("Username: " + value.username);
    } else {
      return <Grid container>
        <Grid xs={12}>{"Username: " + value.username}
        </Grid>
        <Grid xs={12}> {"Full Name: " + value.FullName}
        </Grid>
      </Grid>
    }
  }

  //Advances the multistep form
  _next = () => {
    let currentStep = this.state.currentStep;
    currentStep = currentStep >= 3 ? 4 : currentStep + 1;
    this.setState({direction: true});
    this.setState({currentStep: currentStep});
  };

  //Goes back a step on the multistep form
  _prev = () => {
    let currentStep = this.state.currentStep;
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({direction: false});
    this.setState({currentStep: currentStep});
  };

  /*
  * Displays a button that invokes an option to go back
  */
  previousButton() {
    let currentStep = this.state.currentStep;
    return (
      <Button
        disabled={currentStep === 1 || this.determineNextStatus()}
        onClick={this._prev}
      >Back</Button>
    );
  }


  //Prevents the user from advancing through the form if an error is detected
  determineNextStatus() {
    for (let i = 0; i < this.state.errors.length; i++) {
      if (this.state.errors[i] === 1)
        return true;
    }
    return false;
  }

  /*
   * Displays a button that invokes an option to advance or submit
   */
  nextButton() {
    let currentStep = this.state.currentStep;
    if (currentStep < 4) {
      return (
        <Button variant="contained" color="primary" onClick={this._next} disabled={this.determineNextStatus()}>
          Next
        </Button>
      )
    } else {
      return (
        <Button
          disabled={!this.isFormValid()}
          onClick={() => {
            this.handleSubmit()
          }}
        >
          Submit
        </Button>
      )
    }
  }

  //Provides a Label for the form
  HorizontalLabelPositionBelowStepper = () => {
    const useStyles = makeStyles(theme => ({
      root: {
        width: '100%',
      },
      backButton: {
        marginRight: theme.spacing(1),
      },
      instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
      },
    }));

    function getSteps() {
      return ['Select a Capstone Name + Date', 'Add some Info', 'Add Users', 'Select Pictures'];
    }

    const classes = useStyles();
    const steps = getSteps();
    if (this.props.type === "create") {
      return (
        <div className={classes.root}>
          <Stepper activeStep={this.state.currentStep - 1} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </div>
      );
    }
    return null;
  };

  render() {
    if (this.props.type === "edit") {

      return (
        <React.Fragment>
          <div>
            <this.HorizontalLabelPositionBelowStepper active={this.state.currentStep}/>
            <form onSubmit={this.handleSubmit}>
              {/*render the form steps and pass required props in*/}
              <MyStep1 className={this.props.className} form={this}/>
              <MyStep2 className={this.props.className} form={this}/>
              <div style={{paddingTop: "40px"}}/>
              <Divider/>
              <div style={{paddingTop: "40px"}}/>
              <Divider/>
              <div style={{paddingTop: "40px"}}/>
              <MyStep4 form={this}/>
              <div style={{paddingTop: "40px"}}/>
              <MyStep5 form={this}/>
            </form>
            <Container style={{maxHeight: "50px", alignContent: "center"}}>
              <Button
                disabled={!this.isFormValid()}
                onClick={() => {
                  this.handleSubmit()
                }}
              >
                Submit
              </Button>
            </Container>
          </div>
        </React.Fragment>);
    } else {
      return (
        <React.Fragment>
          <div>
            <this.HorizontalLabelPositionBelowStepper active={this.state.currentStep}/>

            <Scrollable>
              <form onSubmit={this.handleSubmit}>
                {/*render the form steps and pass required props in*/}
                <MyStep1 className={this.props.className} form={this}/>
                <MyStep2 className={this.props.className} form={this}/>
                <MyStep4 form={this}/>
                <MyStep5 form={this}/>
              </form>
            </Scrollable>
            <Container style={{maxHeight: "50px"}}>
              {this.previousButton()}
              {this.nextButton()}
            </Container>
          </div>
        </React.Fragment>
      );
    }
  }

  nameError(props) {
    if (props.state.errors[0] === 1) {
      return props.state.errorMessages[0];
    }
    if (props.state.errors[1] === 1) {
      return props.state.errorMessages[1];
    }
    return null;
  }

  dateError(props) {
    if (props.state.errors[2] === 1) {
      return props.state.errorMessages[2];
    }
    return null;
  }

  descriptionError(props) {
    if (props.state.errors[3] === 1) {
      return props.state.errorMessages[3];
    }
    return null;
  }

  disableCheckBox(value) {
    return this.state.my_id === value._id;
  }

  deleteImage = name => event => {
    let myImages = [];
    for (let i = 0; i < this.state.pictures.length; i++) {
      if (this.state.pictures[i] !== name.tile) {
        myImages.push(this.state.pictures[i]);
      }
    }
    this.setState({pictures: myImages});
  };

  async getPics(pics) {
    let blobs = [];
    let initPics = [];
    for (let i = 0; i < pics.length; i++) {
      initPics.push(pics[i].url);
      let blob = await fetch(pics[i].url).then(r =>
        r.blob());
      blobs.push(blob);
    }
    let myImages = [];
    this.setState({initialPictures: initPics});
    Promise.all(blobs.map(blob => {
      return (new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', (ev) => {
          resolve(ev.target.result);
        });
        reader.addEventListener('error', reject);
        reader.readAsDataURL(blob);
      }));
    }))
      .then(images => {
        /* Once all promises are resolved, update state with image URI array */
        for (let i = 0; i < images.length; i++) {
          myImages.push(images[i]);
        }
        this.setState({pictures: myImages})

      }, error => {
        console.error(error);
      });
  }

  //Used to toggle checkboxes of toggled sponsors
  handleSponsorToggle = value => () => {
    const {checkedSponsors} = this.state;
    const currentIndex = checkedSponsors.indexOf(value);
    const newChecked = this.state.checkedSponsors;
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    this.setState({checkedSponsors: newChecked});
  };

  handleDelete = i => {
    this.setState({
      tags: this.state.tags.filter((tag, index) => index !== i),
    });
  };

  handleAddition = tag => {
    console.log(tag);
    let {tags} = this.state;
    tags.push(tag);
    console.log(tags);
    this.setState({tags: tags});
    console.log(this.state.tags);
  };

  getCheckedSponsors(spons, myCapstone){
    let checkSpons = [];
    for (let i = 0; i < spons.length; i++) {
      for (let j = 0; j < myCapstone.sponsors.length; j++) {
        if (spons[i]._id === myCapstone.sponsors[j]._id) {
          checkSpons.push(spons[i]);
        }
      }
    }
    return checkSpons;
  }

  getSponsors(myCapstone){
    let mySponsors = [];
    for (let i = 0; i < myCapstone.sponsors.length; i++) {
      mySponsors.push(myCapstone.sponsors[i].id);
    }
    return mySponsors;
  }

  getCapstone(caps){
    let myCapstone = [];
    for (let i = 0; i < caps.length; i++) {
      if (caps[i]._id === this.state.cap_id) {
        myCapstone = caps[i];
      }
    }
    return myCapstone;
  }

  getTags(myCapstone){
    let myTags = [];
    for (let i = 0; i < myCapstone.tags.length; i++) {
      myTags.push({id: i, name: myCapstone.tags[i].Name});
    }
    return myTags;
  }

  async awaitPost(){
    const sleep = (milliseconds) => {
      return new Promise(resolve => setTimeout(resolve, milliseconds))
    };
    sleep(1000).then(() => {
      this.redirect(this.state.cap_id);
    });
  }


  handleTagClick = index => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  async upload(response, refId) {
    // Upload image and link it to existing post
    let formData = new FormData();
    let blob = await fetch(this.state.image).then(r => r.blob());
    formData.set("files", blob, this.state.image);
    formData.set("refId", refId);
    formData.set("ref", "capstone");
    formData.set("field", "DisplayPhoto");

    axios.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).catch(function (err) {
      console.log('Upload failed');
      console.log(err);
    });
  }
}

export default CapstoneCreatorForm;
