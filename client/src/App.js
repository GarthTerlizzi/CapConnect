import React from 'react';
import './App.css';
import {fade, ThemeProvider, withStyles} from '@material-ui/core/styles';
import Drawer from './components/NavBar/Drawer';
import NavBar from './components/NavBar';
import {Route, Switch} from "react-router-dom";
import Capstones from "./capstones";
import FAQ from "./faq";
import Account from "./account"
import Home from "./home";
import NewSponsor from "./newsponsor";
import NewCapstone from "./newcapstone";
import Sponsors from "./sponsors";
import Departments from "./departments";
import BasicPage from "./basicpage";
import PhotoPage from "./photopage";
import SponsorRequests from "./sponsorrequests";
import {createMuiTheme, CssBaseline} from "@material-ui/core";
import {
  AccountBalance as AccountBalanceIcon,
  Assignment as AssignmentIcon,
  AssignmentInd as AssignmentIndIcon,
  AssignmentReturn as AssignmentReturnIcon,
  Home as HomeIcon,
  QuestionAnswer as QuestionAnswerIcon,
  School as SchoolIcon,
} from "@material-ui/icons";
import {withAuth0} from "./react-auth0-spa";
import DescriptionIcon from '@material-ui/icons/Description';
import axios from "axios";
import NewCapstoneSponsor from "./newcapstonesponsor";
import CurrentSponsoredCapstones from "./currentsponsorsedcapstones";
import SponsorCapstoneRequests from './sponsorcapstonerequests';
import Marketing from './marketing';

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#154734',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#0066ff',
      main: '#FFB81C',
      // dark: will be calculated from palette.secondary.main,
      // contrastText: '#ffcc00',
    },
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold: 3,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset: 0.2,
  }
});

const drawerWidth = 240;

const styles = {
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    /*[theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
    },*/
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  grow: {
    flexGrow: 1,
  },
  /*menuButton: {
      marginRight: theme.spacing(2),
  },*/
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  sectionAll: {
    display: 'flex',
  },
  sectionHidden: {
    display: 'none',
  },
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dynamicRoutes: {},
      user: undefined,
      open: false,
      authLoad: false,
      routes: {
        // These routes don't show up in the drawer or navbar
        // The navbar indicator will go out of sight to the left
        unlisted: [
          // Don't put anything before this entry you won't be able to navigate to it.
          {
            path: "/",
            name: "Home",
            icon: <HomeIcon/>,
            page: <Home/>
          },
          {
            path: "/account",
            name: "Account",
            icon: <QuestionAnswerIcon/>,
            page: <Account/>,
            active: "ifAuthenticated"
          }
        ],
        // These routes are visible in the drawer and navbar
        listed: [
          {
            path: "/capstones",
            name: "Capstones",
            icon: <AssignmentIcon/>,
            page: <Capstones/>
          },
          {
            path: "/newcapstone",
            name: "Create a Capstone",
            icon: <AssignmentReturnIcon/>,
            page: <NewCapstone/>,
            active: "ifStudentProfessor"
          },
          {
            path: "/sponsors",
            name: "Sponsors",
            icon: <AccountBalanceIcon/>,
            page: <Sponsors/>,
            active: "ifAuthenticated"
          },
          {
            path: "/newsponsor",
            name: "Become A Sponsor",
            icon: <AssignmentIndIcon/>,
            page: <NewSponsor/>,
            active: "ifNotUser"
          },
          {
            path: "/newcapstonesponsor",
            name: "Sponsor a Capstone",
            icon: <AssignmentIndIcon/>,
            page: <NewCapstoneSponsor/>,
            active: "ifSponsor",
          },
          {
            path: "/currentsponsoredcapstones",
            name: "Current Sponsored Capstones",
            icon: <AssignmentIndIcon/>,
            page: <CurrentSponsoredCapstones/>,
            active: "ifSponsor",
          },
          {
            path: "/departments",
            name: "Departments",
            icon: <SchoolIcon/>,
            page: <Departments/>
          },
          {
            path: "/faq",
            name: "FAQ",
            icon: <QuestionAnswerIcon/>,
            page: <FAQ/>
          },
          {
            path: "/sponsorrequests",
            name: "Approve Sponsors",
            icon: <AssignmentIcon/>,
            page: <SponsorRequests/>,
            active: "ifProfessor"
          },
          {
            path: "/sponsorcapstonerequests",
            name: "Sponsor Requests",
            icon: <AssignmentIcon/>,
            page: <SponsorCapstoneRequests/>,
            active: "ifProfessor"
          },
          {
            path: "/marketing",
            name: "All Requests",
            icon: <AssignmentIcon/>,
            page: <Marketing/>,
            active: "ifMarketing"
          },

        ],
        // These routes don't show up in the drawer or navbar
        // They take priority over the listed routes above
        // You can do things like /faq/cheese
        sub: []
      }
    };

    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleStrapi = this.handleStrapi.bind(this);
  }

  async componentDidMount() {
    let {routes} = this.state;

    await this.getDynamicRoutes().then(result => this.setState({
      dynamicRoutes: result
    }));

    // Get some stuff
    this.setState({
      routes: {
        unlisted: [
          ...routes.unlisted,
          /*{
            path: "/",
            name: "Home",
            icon: <HomeIcon/>,
            page: <Home/>
          }*/
        ],
        listed: [
          ...routes.listed,
          /*{
           path: "/",
           name: "Home",
           icon: <HomeIcon/>,
           page: <Home/>
         }*/
        ],
        sub: [
          ...routes.sub,
          /*{
            path: "/",
            name: "Home",
            icon: <HomeIcon/>,
            page: <Home/>
          }*/
        ]
      }
    });

    //Add dynamic routes
    for (let i = 0; i < this.state.dynamicRoutes.length; i++) {
      if (this.state.dynamicRoutes[i]["visibility"] === "listed") {
        let updatedList = this.state.routes;
        updatedList.listed.push(this.state.dynamicRoutes[i]);
        this.setState({routes: updatedList})
      } else if (this.state.dynamicRoutes[i]["visibility"] === "unlisted") {
        let updatedList = this.state.routes;
        updatedList.unlisted.push(this.state.dynamicRoutes[i]);
        this.setState({routes: updatedList})
      }
    }
  }

  async getDynamicRoutes() {
    // Get routes and add to pages
    let url = '/basic-pages/';
    let basicPages = await axios.get(url)
      .then(function (response) {
        return response.data;
      });

    url = '/photo-pages/';
    let photoPages = await axios.get(url)
      .then(function (response) {
        return response.data;
      });


    let dynamicRoutes = [];

    //set basic pages up in routes
    for (let i = 0; i < basicPages.length; i++) {
      if (basicPages[i]["Visibility"] === "listed" || basicPages[i]["Visibility"] === "unlisted") {
        let route =
          {
            path: "/" + basicPages[i]["URL"],
            name: basicPages[i]["NavDisplayText"],
            icon: <DescriptionIcon/>,
            page: <BasicPage/>,
            visibility: basicPages[i]["Visibility"],
            active: basicPages[i]["ViewPermission"]
          };

        //Set permissions from strapi external names to internal names
        if (route.active === "StudentAndProfessor") {
          route.active = "ifStudentProfessor";
        } else if (route.active === "MarketingAndProfessor") {
          route.active = "ifMarketingProfessor";
        } else if (route.active === "Public") {
          route.active = "ifNotUser";
        } else if (route.active === "Authenticated") {
          route.active = "ifAuthenticated";
        } else if (route.active === "Sponsor") {
          route.active = "ifSponsor";
        } else if (route.active === "Marketing") {
          route.active = "ifMarketing";
        } else if (route.active === "Professor") {
          route.active = "ifProfessor";
        } else {
          route.active = "";
        }
        dynamicRoutes.push(route);
      }
    }

    //set photo pages up in routes
    for (let i = 0; i < photoPages.length; i++) {
      if (photoPages[i]["Visibility"] === "listed" || photoPages[i]["Visibility"] === "unlisted") {
        let route =
          {
            path: "/" + photoPages[i]["URL"],
            name: photoPages[i]["NavDisplayText"],
            icon: <DescriptionIcon/>,
            page: <PhotoPage/>,
            visibility: photoPages[i]["Visibility"],
            active: photoPages[i]["ViewPermission"]
          };

        //Set permissions from strapi external names to internal names
        if (route.active === "StudentAndProfessor") {
          route.active = "ifStudentProfessor";
        } else if (route.active === "MarketingAndProfessor") {
          route.active = "ifMarketingProfessor";
        } else if (route.active === "Public") {
          route.active = "ifNotUser";
        } else if (route.active === "Authenticated") {
          route.active = "ifAuthenticated";
        } else if (route.active === "Sponsor") {
          route.active = "ifSponsor";
        } else if (route.active === "Marketing") {
          route.active = "ifMarketing";
        } else if (route.active === "Professor") {
          route.active = "ifProfessor";
        } else {
          route.active = "";
        }
        dynamicRoutes.push(route);
      }
    }
    return dynamicRoutes;
  }

  handleDrawerOpen() {
    this.setState({
      open: true
    })
  };

  handleDrawerClose() {
    this.setState({
      open: false
    })
  };


  handleStrapi(token) {
    //let token = localStorage.getItem("token");
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios.get("/users/me").then(r => {
      //alert(JSON.stringify(r));
      this.setState({user: r.data})
    });
  }


  render() {

    if (!this.state.authLoad && !this.props.auth0.loading && this.props.auth0.isAuthenticated) {
      // Setting state without setState so as to not trigger a rerender
      this.state.authLoad = true;

      // Register the Auth0 account with Strapi
      // Uses the Auth0 user ID as a password. For increased security, follow this tutorial:
      // https://strapi.io/documentation/3.0.0-beta.x/guides/jwt-validation.html
      axios.post('/auth/local', {
        identifier: this.props.auth0.user.nickname,
        password: this.props.auth0.user.sub
      }).then(login => {
        //localStorage.setItem("USER", JSON.stringify(login.data.user))
        //axios.defaults.headers.common['Authorization'] = 'Bearer ' + login.data.jwt;
        this.handleStrapi(login.data.jwt);

      }).catch(error => {
        axios.post('/auth/local/register', {
          username: this.props.auth0.user.nickname,
          email: this.props.auth0.user.email,
          password: this.props.auth0.user.sub,
        }).then(register => {
          //localStorage.setItem("USER", JSON.stringify(register.data.user));
          //axios.defaults.headers.common['Authorization'] = 'Bearer ' + register.data.jwt;
          this.handleStrapi(register.data.jwt);
        })
      });

    }

    let filteredRoutes = {};
    Object.keys(this.state.routes).forEach(subset =>
      filteredRoutes[subset] = this.state.routes[subset].filter(route =>
        (route.active === undefined) ||
        (!!this.props.auth0.isAuthenticated && this.state.user && this.state.user.role.name === "Administrator") ||
        (route.active === "ifStudentProfessor" && !!this.props.auth0.isAuthenticated && this.state.user && (this.state.user.role.name === "Student" || this.state.user.role.name === "Professor")) ||
        (route.active === "ifMarketingProfessor" && !!this.props.auth0.isAuthenticated && this.state.user && (this.state.user.role.name === "Marketing" || this.state.user.role.name === "Professor")) ||
        (route.active === "ifNotUser" && !this.props.auth0.isAuthenticated) ||
        (route.active === "ifNotUser" && !!this.props.auth0.isAuthenticated && this.state.user && (this.state.user.role.name === "Authenticated" || this.state.user.role.name === "Public")) ||
        (route.active === "ifAuthenticated" && !!this.props.auth0.isAuthenticated) ||
        (route.active === "ifSponsor" && !!this.props.auth0.isAuthenticated && this.state.user && this.state.user.role.name === "Sponsor") ||
        (route.active === "ifMarketing" && !!this.props.auth0.isAuthenticated && this.state.user && this.state.user.role.name === "Marketing") ||
        (route.active === "ifProfessor" && !!this.props.auth0.isAuthenticated && this.state.user && this.state.user.role.name === "Professor")
      )
    );

    return <ThemeProvider theme={theme}>
      <div className={this.props.classes.root}>
        <CssBaseline/>
        <NavBar handleDrawerOpen={this.handleDrawerOpen} open={this.state.open} classes={this.props.classes}
                routes={filteredRoutes.listed}/>
        <div className={this.state.open ? this.props.classes.sectionAll : this.props.classes.sectionMobile}>
          <Drawer handleDrawerClose={this.handleDrawerClose} open={this.state.open} classes={this.props.classes}
                  routes={filteredRoutes.listed}/>
        </div>
        <div className="App">
          <header className="App-header">
            <Switch>
              {filteredRoutes.sub.slice(0).reverse().map(route =>
                <Route key={route.path} path={route.path}>{route.page}</Route>
              )}
              {filteredRoutes.listed.slice(0).reverse().map(route =>
                <Route key={route.path} path={route.path}>{route.page}</Route>
              )}
              {filteredRoutes.unlisted.slice(0).reverse().map(route =>
                <Route key={route.path} path={route.path}>{route.page}</Route>
              )}
            </Switch>
          </header>
        </div>
      </div>
    </ThemeProvider>;
  }
}

export default withStyles(styles)(withAuth0(App));
