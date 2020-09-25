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

const Login = (props) => {
    const { classes } = props;
    const history = useHistory();

    const [input, setInput] = useState({
        email: "",
        password: "",
        showPassword: false,
    });

    const [, setDataUser, , setIsLoggedIn] = useContext(LoginContext);

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
        Axios.post("https://backendexample.sanbersy.com/api/user-login", {
            email: input.email,
            password: input.password,
        }).then((response) => {
            console.log(response);
            if (response.status === "400") {
                return alert("Invalid Email or Password!");
            } else {
                setDataUser({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    token: response.data.token,
                });
                setInput({ ...input, email: "", password: "" });
                localStorage.setItem("dataUser", JSON.stringify({
                    name: response.data.user.name,
                    email: response.data.user.email,
                    token: response.data.token,
                }));
                setIsLoggedIn(true);
                history.push("/list_movie");
            }
        });
    };

    return (
        <div className={classes.root}>
            <Grid container alignItems="stretch" className={classes.container}>
                <Grid item xs sm md lg className={classes.formContainer}>
                    <TextField
                        id="outlined-basic"
                        label="Email"
                        name="email"
                        variant="outlined"
                        className={classes.margin}
                        value={input.email}
                        onChange={handleChange}
                    />
                    <FormControl variant="outlined" className={classes.margin}>
                        <InputLabel htmlFor="outlined-adornment-password">
                            Password
                        </InputLabel>
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
                                        {input.showPassword ? (
                                            <Visibility />
                                        ) : (
                                            <VisibilityOff />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                            labelWidth={70}
                        />
                    </FormControl>
                    <div className={classes.submit}>
                        <Link to="/register">
                            <Button size="large">Belum Punya Akun?</Button>
                        </Link>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleClick}
                        >
                            Login
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default withStyles(styles)(Login);
