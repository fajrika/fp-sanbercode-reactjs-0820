import React from "react";
import ReactDOM from "react-dom";

import { Component } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Appbar from "./components/Appbar";
import { LoginProvider } from "./context/LoginContext";

class App extends Component {
  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <LoginProvider>
          <Appbar />
        </LoginProvider>
      </React.Fragment>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
