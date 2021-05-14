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
        email: "",
        mobile: "",
        passwordReg: "",
        emailRequired: "dispNone",
        firstnameRequired: "dispNone",
        lastnameRequired: "dispNone",
        mobileRequired: "dispNone",
        passwordRegRequired: "dispNone",
        registrationSuccess: false,
        signupError: "dispNone",
        signUpErrorMsg: "",
        signUpErrCode: "",
        open: false,
        anchorEl: null,
        snackBarOpen: false,
        menuIsOpen: false,
        modalIsOpen: false,
        showUserProfileDropDown: false,
        value: 0
      }
    }

    //Transferring signup values to its respective states
    inputUsernameChangeHandler = (e) => {
      this.setState({ username: e.target.value })
    }
    inputPasswordChangeHandler = (e) => {
      this.setState({ password: e.target.value })
    }
    inputEmailChangeHandler = (e) => {
      this.setState({ email: e.target.value })
    }
    inputFirstnameChangeHandler = (e) => {
      this.setState({ firstname: e.target.value })
    }
    inputLastnameChangeHandler = (e) => {
      this.setState({ lastname: e.target.value })
    }
    inputMobileChangeHandler = (e) => {
      this.setState({ mobile: e.target.value })
    }
    inputPasswordRegChangeHandler = (e) => {
      this.setState({ passwordReg: e.target.value })
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

    //Signup functionality
    signUpClickHandler = () => {
      //invalidate states
      this.setState({ signUpErrorMsg: "" });
      this.setState({ signUpErrCode: "" });
      //Empty fields check
      this.state.email === "" ? this.setState({ emailRequired: "dispBlock" }) : this.setState({ emailRequired: "dispNone" });
      this.state.firstname === "" ? this.setState({ firstnameRequired: "dispBlock" }) : this.setState({ firstnameRequired: "dispNone" });
      this.state.mobile === "" ? this.setState({ mobileRequired: "dispBlock" }) : this.setState({ mobileRequired: "dispNone" });
      this.state.passwordReg === "" ? this.setState({ passwordRegRequired: "dispBlock" }) : this.setState({ passwordRegRequired: "dispNone" });
      if (this.state.email === "" || this.state.firstname === "" || this.state.mobile === "" || this.state.passwordReg === "") { return; }
  
      let that = this;
      let dataSignup = {
        'first_name': this.state.firstname,
        'last_name': this.state.lastname,
        'email_address': this.state.email,
        'password': this.state.passwordReg,
        'contact_number': this.state.mobile,
      };
  
      let xhrSignup = new XMLHttpRequest();
      xhrSignup.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          let signupResponse = JSON.parse(this.response);
          if (signupResponse.code === 'SGR-001'
            || signupResponse.code === 'SGR-002'
            || signupResponse.code === 'SGR-003'
            || signupResponse.code === 'SGR-004') {
            that.setState({ signupError: "dispBlock" });
  
            that.setState({ signUpErrCode: signupResponse.code });
            that.setState({ signUpErrorMsg: signupResponse.message });
  
          } else {
            that.setState({ registrationSuccess: true });
            that.setState({ snackBarText: "Registered successfully! Please login now!" });
            that.openMessageHandler();
          }
        }
      })
  
      xhrSignup.open("POST", this.props.baseUrl + "customer/signup");
      xhrSignup.setRequestHeader("Content-Type", "application/json");
      xhrSignup.setRequestHeader("Cache-Control", "no-cache");
      xhrSignup.setRequestHeader("Access-Control-Allow-Origin", "*");
      xhrSignup.send(JSON.stringify(dataSignup));
    }

    //Open modal functionality
    openModalHandler = () => {
      //invalidating all states value while modal is opened
      this.setState({ modalIsOpen: true });
      this.setState({ value: 0 });
      this.setState({ email: "" });
      this.setState({ firstname: "" });
      this.setState({ lastname: "" });
      this.setState({ mobile: "" });
      this.setState({ signUpErrorMsg: "" });
      this.setState({ signUpErrCode: "" });
      this.setState({ passwordReg: "" });
      this.setState({ loginInvalidContactNo: "" });
      this.setState({ loginErrCode: "" });
      this.setState({ loginErrorMsg: "" });
      this.setState({ usernameRequired: "dispNone" });
      this.setState({ passwordRequired: "dispNone" });
      this.setState({ loginError: "dispNone" });
      this.setState({ signupError: "dispNone" });
      this.setState({ emailRequired: "dispNone" });
      this.setState({ firstnameRequired: "dispNone" });
      this.setState({ lastnameRequired: "dispNone" });
      this.setState({ mobileRequired: "dispNone" });
      this.setState({ passwordRegRequired: "dispNone" });
      this.setState({ loginErrorMsg: "" });
    }

    //Close modal functinality & snack bar open message
    closeModalHandler = () => {
      this.setState({ modalIsOpen: false });
      this.setState({ snackBarOpen: true });
    }

    //Close modal when clicked anyway
    closeModalHandlerClickAway = () => {
      this.setState({ modalIsOpen: false });
      this.setState({ snackBarOpen: false });
    }

    //Login & Signup tab toggle
    tabChangeHandler = (event, value) => {
      this.setState({ value });
    }

    //Open snackbar and navigate to login tab after signup
    openMessageHandler = () => {
      this.setState({ snackBarOpen: true });
      this.setState({ modalIsOpen: true });
      this.setState({ value: 0 });
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
  