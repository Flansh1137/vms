import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Typography, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart'; // Updated icon for Data Analysis
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../../assets/logo.png'; // Path to your logo

const MinimalNavBar = () => {
  const { isAuthenticated, logout } = useAuth0();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Admin Login', path: '/AdminLoginForm', icon: <AdminPanelSettingsIcon /> },
    { text: 'New Registration', path: '/new-registration', icon: <AssignmentIcon /> },
    { text: 'Main Program', path: '/main-program', icon: <DashboardIcon /> },
    { text: 'Data Analysis', path: '/data-analysis', icon: <BarChartIcon /> } // Updated to Data Analysis
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <Link to="/">
            <img className="h-10 w-auto" src={logo} alt="Logo" />
          </Link>
        </div>
        
        {isAuthenticated && (
          <div className="flex items-center">
            {/* Hamburger Menu Icon */}
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu" 
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Drawer for Hamburger Menu */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <div
                className="w-64"
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  {/* Mapping through the menu items and adding icons */}
                  {menuItems.map((item) => (
                    <ListItem button component={Link} to={item.path} key={item.text}>
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="h6" sx={{ fontWeight: 500 }}>
                            {item.text}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  {/* Logout Button inside the Drawer */}
                  <ListItem button onClick={() => logout({ returnTo: window.location.origin })}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          Logout
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </div>
            </Drawer>
          </div>
        )}
      </div>
    </nav>
  );
};

export default MinimalNavBar;
