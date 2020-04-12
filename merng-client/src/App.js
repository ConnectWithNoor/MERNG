import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';
import MenuBar from './components/MenuBar';

import { AuthContextProvider } from './context/authContext';
import AuthRoute from './utiities/AuthRoute';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
