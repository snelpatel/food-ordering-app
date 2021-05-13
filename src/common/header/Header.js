import React, { Component } from "react";
import "./Header.css";
import Fastfood from '@material-ui/icons/Fastfood';
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from '@material-ui/core/styles';
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)'
    }
  }

  const styles = {
    root: {
      color: "#FFFFFF"
    },
    searchInput: {
      width: "80%",
      color: "white"
    },
    icon: {
      color: '#FFFFFF',
      fontSize: 32,
    },
    formControl: {
      width: "90%"
    }
  }

  const TabContainer = function (props) {
    return (
      <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
        {props.children}
      </Typography>
    );
  }

  class Header extends Component {
    constructor() {
      super();
      this.state = {
        
      }
    }
  
    
  
    componentDidMount() {
    }
  
    render() {
      const { classes } = this.props;
      let logoToRender = null;
      logoToRender = (
        <Fastfood className={classes.icon} />
      )
  
      return (
        <div className="topMain">
          <div className="header-main-container">
            <div className="header-logo-container">{logoToRender}</div>
            {this.props.showSearch &&
              <div className="header-search-container">
                <div className="search-icon">
                  <SearchIcon style={{ color: "#FFFFFF" }} />
                </div>
                <Input
                  className={classes.searchInput}
                  placeholder="Search by Restaurant Name"
                />
              </div>
            }
            
              <div>
                <Button style={{ fontSize: "100%" }} variant="contained" color="default"><AccountCircle /><span style={{ marginLeft: "2%" }}>Login</span></Button>
              </div>
            
          </div>
          
          
        </div>
      );
    }
  }
  export default withStyles(styles)(Header);
  