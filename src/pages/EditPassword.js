import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { LoginContext } from "../context/LoginContext";
import { useHistory } from "react-router-dom";
import Axios from "axios";

const styles = (theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2),
    display: "flex",
    justifyContent: "space-between",
  },
  root: {
    flexGrow: 1,
  },
  container: {
    maxWidth: "500px",
    margin: "1% auto",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "75%",
  },
});

const EditPassword = (props) => {
  const { classes } = props;
  const history = useHistory();
  const dataStorageUser = JSON.parse(localStorage.getItem("dataUser"));

  const [, setDataUser, ,] = useContext(LoginContext);

  const [input, setInput] = useState({
    username: dataStorageUser.username,
    password: dataStorageUser.password,
    showPassword: false,
  });

  const handleChange = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setInput({ ...input, showPassword: !input.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    Axios.put(`https://backendexample.sanbersy.com/api/users/${dataStorageUser.id}`, {
      username: dataStorageUser.username,
      password: input.password,
    })
      .then((response) => {
        setDataUser({
          username: response.data.username,
          password: response.data.password,
        });
        setInput({ ...input, username: "", password: "" });
        localStorage.setItem("dataUser", JSON.stringify(response.data));
        alert("Edit Password Berhasil!");
        history.push("/list_movie");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={classes.root}>
      <Grid container alignItems="stretch" className={classes.container}>
        <Grid item xs sm md lg className={classes.formContainer}>
          <TextField
            disabled
            id="outlined-basic"
            label="Username"
            name="username"
            variant="outlined"
            className={classes.margin}
            value={input.username}
            onChange={handleChange}
          />
          <FormControl variant="outlined" className={classes.margin}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={input.showPassword ? "text" : "password"}
              value={input.password}
              name="password"
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {input.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
          <div className={classes.submit}>
            <Button variant="contained" size="large" onClick={handleClick}>
              Edit Password
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(EditPassword);
