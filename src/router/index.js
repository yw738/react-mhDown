import React from "react";
import {
  HashRouter as Router,
  // BrowserRouter  as Router,
  Switch,
  Route,
  //   useHistory,
} from "react-router-dom";
import Index from "./../pages/index/index";
// import Header from "./../pages/public/header";
import List from "./../pages/list/index";
import Error from "./../pages/public/500";
export default function App() {
  return (
    <Router>
      <div>
        {/* <Header /> */}
        <Switch>
          <Route path="/list/:id/:title" component={List}></Route>
          <Route path="/error" component={Error}></Route>
          <Route path="/">
            <Index />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
