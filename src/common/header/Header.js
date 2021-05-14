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

  
TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

  class Header extends Component {
    constructor() {
      super();
      this.state = {
        loginInvalidContactNo: "",
        username: "",
        password: "",
        loginErrorMsg: "",
        usernameRequired: "dispNone",
        passwordRequired: "dispNone",
        loginError: "dispNone",
        loginErrCode: "",
        firstname: "",
        lastname: "",
        loggedIn: sessionStorage.getItem('access-token') == null ? false : true,
        snackBarText: "",
      
      }
    }
  
    
  
    componentDidMount() {
    }

    //Login functionality
    loginClickHandler = () => {
      //Invalidate error messages
      this.setState({ loginInvalidContactNo: "" })
      //Check blank inputs
      this.state.username === "" ? this.setState({ usernameRequired: "dispBlock" }) : this.setState({ usernameRequired: "dispNone" });
      this.state.password === "" ? this.setState({ passwordRequired: "dispBlock" }) : this.setState({ passwordRequired: "dispNone" });
      this.state.loginErrorMsg === "" ? this.setState({ loginError: "dispBlock" }) : this.setState({ loginError: "dispNone" });
      //Returns if username and password fields are null
      if (this.state.username === "" || this.state.password === "") { return }
      let tempContactNo = this.state.username;
      //Contact number should be 10 digits in length
      var reg = new RegExp('^[0-9]+$');
      if (tempContactNo.length !== 10 || !reg.test(tempContactNo)) {
        this.setState({ loginInvalidContactNo: "Invalid Contact" })
        return;
      }
  
      let that = this;
      let dataLogin = null
      let xhrLogin = new XMLHttpRequest();
      xhrLogin.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          let loginResponse = JSON.parse(xhrLogin.response);
          if (loginResponse.code === 'ATH-001' || loginResponse.code === 'ATH-002') {
            that.setState({ loginError: "dispBlock" });
            that.setState({ loginErrCode: loginResponse.code });
            that.setState({ loginErrorMsg: loginResponse.message });
          } else {
            sessionStorage.setItem('uuid', JSON.parse(this.responseText).id);
            sessionStorage.setItem('access-token', xhrLogin.getResponseHeader('access-token'));
            sessionStorage.setItem('firstName', JSON.parse(this.responseText).first_name);
            that.setState({ firstname: JSON.parse(this.responseText).first_name });
            that.setState({ loggedIn: true });
            that.closeModalHandler();
            that.setState({ snackBarText: "Logged in successfully!" });
            that.openMessageHandlerPostLogin();
          }
        }
      })
      xhrLogin.open("POST", this.props.baseUrl + "customer/login");
      xhrLogin.setRequestHeader("authorization", "Basic " + window.btoa(this.state.username + ":" + this.state.password));
      xhrLogin.setRequestHeader("Content-Type", "application/json");
      xhrLogin.setRequestHeader("Cache-Control", "no-cache");
      xhrLogin.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhrLogin.send(dataLogin);
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
  