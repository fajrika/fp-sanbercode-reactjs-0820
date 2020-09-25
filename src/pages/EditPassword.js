import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import {
    Grid,
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

    const [dataUser, setDataUser, ,setIsLoggedIn] = useContext(LoginContext);

    const [input, setInput] = useState({
        password: "",
        newPass: "",
        newPass2: "",
        showPassword: false,
        showNewPass: false,
        showNewPass2: false,
    });

    const handleChange = (event) => {
        setInput({ ...input, [event.target.name]: event.target.value });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClick = () => {
        Axios.post(
            "https://backendexample.sanbersy.com/api/change-password",
            {
                current_password: input.password,
                new_password: input.newPass,
                new_confirm_password: input.newPass2,
            },
            {
                headers: {
                    Authorization: "Bearer " + dataStorageUser.token,
                    "Content-Type": "application/json",
                },
            }
        )
            .then((response) => {
                setDataUser({
                    username: response.data.username,
                    password: response.data.password,
                });
                setInput({ ...input, username: "", password: "" });
                // localStorage.setItem("dataUser", JSON.stringify(response.data));
                setDataUser({ ...dataUser, name: "", email: "", token: "" });
                localStorage.clear();
                setIsLoggedIn(false);
                alert("Edit Password Berhasil!");
                history.push("/login");
            })
            .catch((error) => {
                alert("Edit Gagal!");
                console.log(error);
            });
    };

    return (
        <div className={classes.root}>
            <Grid container alignItems="stretch" className={classes.container}>
                <Grid item xs sm md lg className={classes.formContainer}>
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
                                        onClick={() =>
                                            setInput({
                                                ...input,
                                                showPassword: !input.showPassword,
                                            })
                                        }
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
                    <FormControl variant="outlined" className={classes.margin}>
                        <InputLabel htmlFor="outlined-adornment-password">
                            New Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={input.showNewPass ? "text" : "password"}
                            value={input.newPass}
                            name="newPass"
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle newPass visibility"
                                        onClick={() =>
                                            setInput({
                                                ...input,
                                                showNewPass: !input.showNewPass,
                                            })
                                        }
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {input.showNewPass ? (
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
                    <FormControl variant="outlined" className={classes.margin}>
                        <InputLabel htmlFor="outlined-adornment-password">
                            New Confirm Password
                        </InputLabel>
                        <OutlinedInput
                            id="outlined-adornment-password"
                            type={input.showNewPass2 ? "text" : "password"}
                            value={input.newPass2}
                            name="newPass2"
                            onChange={handleChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle newPass2 visibility"
                                        onClick={() =>
                                            setInput({
                                                ...input,
                                                showNewPass2: !input.showNewPass2,
                                            })
                                        }
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {input.showNewPass2 ? (
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
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleClick}
                        >
                            Edit Password
                        </Button>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default withStyles(styles)(EditPassword);
