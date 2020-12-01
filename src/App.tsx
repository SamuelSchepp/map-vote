import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from "./pages/Home";
import Vote from "./pages/Vote";
import { FirebaseService } from "./FirebaseService";
import { User } from "./User";
import Results from "./pages/Results";


function App(props: {firebase: FirebaseService, user: User}) {
  return (
    <Router>
      <Switch>
        <Route path="/vote/:voteId/results">
          <Results firebase={props.firebase} user={props.user} />
        </Route>
        <Route path="/vote/:voteId">
          <Vote firebase={props.firebase} user={props.user} />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
