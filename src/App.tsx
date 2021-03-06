import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
//  Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home';
import Cars from './Cars';

function App() {
  return (
    <Router>
      <main>
        <nav className="navbar navbar-expand navbar-dark bg-dark" aria-label="Second navbar example">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Home</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarsExample02" aria-controls="navbarsExample02" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarsExample02">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/cars-list">Cars</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <Switch>
          <Route path="/cars-list">
            <Cars />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </main>
    </Router>
  );
}

export default App;
