import React, { useState, useEffect } from 'react';
import { AppBar, Typography, Toolbar, Avatar, Button } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  // Use a functional state to grab the user safely
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const navigate = useNavigate();
  const location = useLocation();

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate('/auth');
  };

  useEffect(() => {
    // When the URL changes (like after login), refresh the user data
    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={1}
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 2, sm: 4 },
        py: 1.5,
        minHeight: 64,
      }}
    >
      <Typography
        component={Link}
        to="/"
        variant="h5"
        fontWeight="bold"
        sx={{ textDecoration: 'none', color: 'black', lineHeight: 1 }}
      >
        PostApp
      </Typography>
      <Toolbar disableGutters sx={{ minHeight: 'auto', alignItems: 'center', gap: 2 }}>
        {user?.result ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Check for username (from your backend) OR name */}
            {/* Replace your old Typography/Avatar logic with this */}
            <Avatar 
                alt={user?.result?.username || 'User'} 
                src={user?.result?.picture} // In case you add profile pics later   
            >
            {/* If username exists, take the 1st letter; otherwise, show 'U' */}
                {(user?.result?.username || 'User').charAt(0).toUpperCase()}
            </Avatar>

            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {user?.result?.username ? user.result.username : (user?.result?.name ? user.result.name : "User")}
            </Typography>
            <Button variant="contained" color="secondary" onClick={logout} size="medium">
              LOGOUT
            </Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;