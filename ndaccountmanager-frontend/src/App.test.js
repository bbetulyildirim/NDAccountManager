impoimport React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import AccountManagement from './components/AccountManagement';
import Settings from './components/Settings';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('token') ? (
        <Component {...props} />
      ) : (
        <Navigate to="/" />
      )
    }
  />
);

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" exact element={<Login />} />
          <PrivateRoute path="/home" element={<Home />} />
          <PrivateRoute path="/account-management" element={<AccountManagement />} />
          <PrivateRoute path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
