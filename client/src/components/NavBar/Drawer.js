import React from 'react';
import clsx from 'clsx';
import {withTheme} from '@material-ui/core/styles';
import {Divider, Drawer, IconButton, List} from '@material-ui/core';
import {ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon} from '@material-ui/icons';
import LinkItem from "./LinkItem";

export default withTheme(class extends React.Component {
  render() {
    const classes = this.props.classes;
    return (
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: this.props.open,
          [classes.drawerClose]: !this.props.open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: this.props.open,
            [classes.drawerClose]: !this.props.open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={this.props.handleDrawerClose}>
            {this.props.theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
          </IconButton>
        </div>
        <Divider/>
        <List>
          {this.props.routes.map(route => <LinkItem key={route.path} text={route.name}
                                                    to={route.path}>{route.icon}</LinkItem>)}
        </List>
        {/*<List>
                    <LinkItem text='Home' to="/"><HomeIcon/></LinkItem>
                    <LinkItem text='Users' to="/users"><MenuIcon/></LinkItem>
                    <LinkItem text='About' to="/about"><MenuIcon/></LinkItem>
                    <LinkItem text='FAQ' to="/faq"><MenuIcon/></LinkItem>
                </List>
                <Divider/>
                <List>
                    <LinkItem text='Home' to="/"><HomeIcon/></LinkItem>
                    <LinkItem text='Users' to="/users"><MenuIcon/></LinkItem>
                    <LinkItem text='About' to="/about"><MenuIcon/></LinkItem>
                </List>*/}
      </Drawer>
    )
  }
})
