import React, { useState } from "react";
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
import { Link, useHistory } from "react-router-dom";
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

const Register = (props) => {
  const { classes } = props;
  const history = useHistory();

  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
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
    Axios.post("https://backendexample.sanbersy.com/api/register", {
      name: input.name,
      email: input.email,
      password: input.password,
    })
      .then((response) => {
        alert("Silahkan Login");
        history.push("/login");
      })
      .catch((error) => {
        console.log(error);
        alert(error);
      });
  };

  return (
    <div className={classes.root}>
      <Grid container alignItems="stretch" className={classes.container}>
        <Grid item xs sm md lg className={classes.formContainer}>
          <TextField
            id="outlined-basic"
            label="Name"
            name="name"
            variant="outlined"
            className={classes.margin}
            value={input.name}
            onChange={handleChange}
          />
          <TextField
            id="outlined-basic"
            label="email"
            name="email"
            variant="outlined"
            className={classes.margin}
            value={input.email}
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
            <Link to="/login">
              <Button size="large">Sudah Punya Akun?</Button>
            </Link>

            <Button variant="contained" size="large" onClick={handleClick}>
              Register
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default withStyles(styles)(Register);
