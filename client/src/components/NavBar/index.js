import React from 'react';
import {AppBar, Badge, Button, IconButton, Menu, MenuItem, Toolbar} from '@material-ui/core';
import {
  AccountCircle,
  Mail as MailIcon,
  Menu as MenuIcon,
  MoreVert as MoreIcon,
  Notifications as NotificationsIcon
} from '@material-ui/icons';
import clsx from "clsx";
import CustomTabs from "./CustomTabs";
import CapConnectIcon from "../CapConnectIcon"
import {Link, withRouter} from "react-router-dom";
import {withAuth0} from "../../react-auth0-spa";

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null
    };

    this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
  }

  handleProfileMenuOpen(event) {
    this.setState({anchorEl: event.currentTarget});
  };

  handleMobileMenuClose() {
    this.setState({mobileMoreAnchorEl: null});
  };

  handleMenuClose() {
    this.setState({anchorEl: null});
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen(event) {
    this.setState({mobileMoreAnchorEl: event.currentTarget});
  };

  handleLogout = () => {
    this.props.auth0.logout({returnTo: window.location.href});
    localStorage.clear();
    this.handleMenuClose();
  };

  handleToAccount = () => {
    this.props.history.push("/account");
    this.handleMenuClose();
  };

  render() {
    const classes = this.props.classes;

    const isMenuOpen = Boolean(this.state.anchorEl);
    const isMobileMenuOpen = Boolean(this.state.mobileMoreAnchorEl);

    const menuItems = [
      /*{
        text: "Messages",
        button: props => <IconButton aria-label="show 4 new mails" color="inherit" {...props}>
          <Badge badgeContent={4} color="secondary">
            <MailIcon/>
          </Badge>
        </IconButton>,
        onClick: () => {}
      },{
      text: "Notifications",
        button: props => <IconButton aria-label="show 11 new notifications" color="inherit" {...props}>
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon/>
          </Badge>
        </IconButton>,
        onClick: () => {}
      },*/{
        text: "Account",
        button: props => <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
          {...props}
        >
          <AccountCircle/>
        </IconButton>,
        onClick: this.handleProfileMenuOpen
      }
    ];

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
      <Menu
        anchorEl={this.state.anchorEl}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        id={menuId}
        keepMounted
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        {!this.props.auth0.isAuthenticated && <React.Fragment>
          <MenuItem onClick={() => this.props.auth0.loginWithRedirect({redirect_uri: window.location.href})}>Login / Register</MenuItem>
        </React.Fragment>}
        {this.props.auth0.isAuthenticated && [
          <MenuItem onClick={this.handleToAccount}>Account</MenuItem>,
          <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
        ]}
      </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
      <Menu
        anchorEl={this.state.mobileMoreAnchorEl}
        anchorOrigin={{vertical: 'top', horizontal: 'right'}}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
        open={isMobileMenuOpen}
        onClose={this.state.handleMobileMenuClose}
        className={classes.sectionMobile}
      >
        {menuItems.map(item => <MenuItem onClick={item.onClick}>
          <item.button />
          <p>{item.text}</p>
        </MenuItem>)}
      </Menu>
    );

    return (
      <div className={classes.grow}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: this.props.open,
          })}
        >
          <Toolbar>
            <div className={classes.sectionMobile}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.props.handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: this.props.open,
                })}
              >
                <MenuIcon/>
              </IconButton>
            </div>
            {/*}
                        <Tab className={classes.title}
                             label={<Typography className={classes.title} variant="h6">
                            University </Typography>}
                          component={Link}
                          to="/" >
                        </Tab>*/}

            <Button
              component={Link}
              to="/"
              startIcon={<CapConnectIcon/>}
            >
              Baylor
            </Button>


            {/*
                      <img height={50} width={50} src={"assets/CapConnectLogo.png"} alt="Logo" />
                      <Tab  className={classes.title}  component={Link} to={"/"}
                            label={<Typography className={classes.title} color="inherit" noWrap>
                              Baylor | CapConnect
                            </Typography>}
                      >
                      </Tab>
                      */}

            <div className={classes.sectionDesktop} style={{maxWidth: "80%"}}>
              <CustomTabs routes={this.props.routes}/>
            </div>
            <div className={classes.grow}/>
            <div className={menuItems.length <= 1 ? classes.sectionAll : classes.sectionDesktop}>
              {menuItems.map(item => <div onClick={item.onClick}><item.button/></div>)}
            </div>
            <div className={menuItems.length <= 1 ? classes.sectionHidden : classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={this.handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon/>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    );
  }
}

export default withAuth0(withRouter(NavBar));

