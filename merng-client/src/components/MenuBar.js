import React, { memo, useState, useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

function MenuBar() {
  const { pathname } = useLocation();
  const { user, logout } = useContext(AuthContext);

  const [activeItem, setActiveItem] = useState(
    pathname === '/' ? 'home' : pathname.substr(1)
  );

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBarMarkup = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item name={user.username} active as={Link} to="/" />

      <Menu.Menu position="right">
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />

      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBarMarkup;
}

export default memo(MenuBar);
