import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingPage from "./pages/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
class App extends Component {
  render() {
    return (
     <BrowserRouter>
             <MainNavigation/>
         <main className="main-content">
             <Switch>
                 <Redirect from='/' to='/auth' exact/>
                 <Route path='/auth' component={AuthPage}/>
                 <Route path='/events' component={EventsPage}/>
                 <Route path='/booking' component={BookingPage}/>
             </Switch>
         </main>
     </BrowserRouter>
    );
  }
}

export default App;
