import React, { useState, Fragment, useContext } from "react";
import clsx from "clsx";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  Movie as MovieIcon,
  SportsEsports as GameIcon,
  VpnKey as LoginIcon,
  ExitToApp as LogoutIcon,
  Edit as EditIcon,
} from "@material-ui/icons";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import Movie from "./../pages/Movie";
import MovieList from "./../pages/MovieList";
import Game from "./../pages/Game";
import GameList from "./../pages/GameList";
import Login from "../pages/Login";
import Register from "../pages/Register";

import { LoginContext } from "../context/LoginContext";
import EditPassword from "../pages/EditPassword";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    minHeight: "100vh",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  footer: {
    display: "flex",
    textAlign: "center",
    // minHeight: "100vh",
    flexDirection: "column",
  },
}));

export default function Appbar() {
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  const [title, setTitle] = useState(() => {
    let tmp = Capitalize(
      window.location.pathname === "/"
        ? "Home"
        : window.location.pathname.indexOf("/", 1) === -1
          ? window.location.pathname.substr(1)
          : window.location.pathname.substr(1, window.location.pathname.indexOf("/", 1) - 1)
    );
    if (tmp === "List_game") return "List Game";
    else if (tmp === "List_movie") return "List Movie";
    return tmp;
  });

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [dataUser, setDataUser, isLoggedIn, setIsLoggedIn] = useContext(LoginContext);

  const dataStorageUser = JSON.parse(localStorage.getItem("dataUser"));

  const handleLogout = () => {
    setDataUser({ ...dataUser, username: "", password: "" });
    setIsLoggedIn(false);
    localStorage.clear();
  };

  const editorItem = (
    <>
      <ListItem
        button
        component={Link}
        to="/list_movie"
        onClick={() => {
          setTitle("List Movie");
        }}
      >
        <ListItemIcon>
          <MovieIcon />
        </ListItemIcon>
        <ListItemText primary="List Movie" />
      </ListItem>
      <ListItem
        button
        component={Link}
        to="/list_game"
        onClick={() => {
          setTitle("List Game");
        }}
      >
        <ListItemIcon>
          <GameIcon />
        </ListItemIcon>
        <ListItemText primary="List Game" />
      </ListItem>


      <Divider />
      <ListItem
        button
        component={Link}
        to="/edit_password"
        onClick={() => {
          setTitle("Edit Password");
        }}
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText primary="Edit Password" />
      </ListItem>

      <ListItem
        button
        component={Link}
        to="/"
        onClick={() => {
          handleLogout();
          setTitle("You have been Logout")
        }}
      >
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItem>
    </>
  );

  const loginItem = (
    <>
      <ListItem
        button
        component={Link}
        to="/login"
        onClick={() => {
          setTitle("Login");
        }}
      >
        <ListItemIcon>
          <LoginIcon />
        </ListItemIcon>
        <ListItemText primary="Login" />

      </ListItem>

    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.root}>
        <CssBaseline />
        <Fragment>
          <AppBar
            position="fixed"
            className={clsx(classes.appBar, {
              [classes.appBarShift]: open,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                  [classes.hide]: open,
                })}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap>
                {title}
              </Typography>
            </Toolbar>
          </AppBar>
        </Fragment>

        <Router>
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              }),
            }}
          >
            <div className={classes.toolbar}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
              </IconButton>
            </div>
            <Divider />
            <List>
              <ListItem
                button
                component={Link}
                to="/"
                onClick={() => {
                  setTitle("Movie");
                }}
              >
                <ListItemIcon>
                  <MovieIcon />
                </ListItemIcon>
                <ListItemText primary="Movie" />
              </ListItem>
              <ListItem
                button
                component={Link}
                to="/game"
                onClick={() => {
                  setTitle("Game");
                }}
              >
                <ListItemIcon>
                  <GameIcon />
                </ListItemIcon>
                <ListItemText primary="Game" />
              </ListItem>
            </List>
            <Divider />
            <List>{isLoggedIn || dataStorageUser !== null ? editorItem : loginItem}</List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.toolbar} />

            <Switch>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/register">
                <Register />
              </Route>
              <Route exact path="/edit_password">
                <EditPassword />
              </Route>
              <Route exact path="/game">
                <Game />
              </Route>
              <Route exact path="/list_movie">
                <MovieList />
              </Route>
              <Route exact path="/list_game">
                <GameList />
              </Route>
              <Route exact path="/">
                <Movie />
              </Route>
            </Switch>

            {/* <Route path="/grid" component={Grid} /> */}
          </main>
        </Router>
      </div>
      <div
        className={classes.footer}
        style={{
          backgroundColor: "black",
          color: "white",
          height: "40px",
          verticalAlign: "middle",
          paddingTop: "10px",
        }}
      >
        <span>Copyright Pemula Belajar Reactjs - 2020 / Fajrika </span>
      </div>
    </ThemeProvider>
  );
}
