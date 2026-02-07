import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField, Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../api';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleToggle = () => setIsSignup((prev) => !prev);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignup) {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords don't match!");
          return;
        }
        const { data } = await signUp(formData);
        localStorage.setItem('profile', JSON.stringify(data));
      } else {
        const { data } = await signIn(formData);
        localStorage.setItem('profile', JSON.stringify(data));
      }
      navigate('/posts');
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper 
          elevation={6} 
          sx={{ 
            padding: 4, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            borderRadius: 3 
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          
          <Typography variant="h5" sx={{ mb: 3 }}>
            {isSignup ? 'Create Account' : 'Sign In'}
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            {/* We keep Grid but remove the 'item' prop to satisfy the warning */}
            <Grid container spacing={2}>
              {isSignup && (
                <>
                  <Grid xs={6}>
                    <TextField name="firstName" label="First Name" onChange={handleChange} autoFocus fullWidth required />
                  </Grid>
                  <Grid xs={6}>
                    <TextField name="lastName" label="Last Name" onChange={handleChange} fullWidth required />
                  </Grid>
                </>
              )}
              <Grid xs={12}>
                <TextField name="email" label="Email Address" onChange={handleChange} type="email" fullWidth required />
              </Grid>
              <Grid xs={12}>
                <TextField name="password" label="Password" onChange={handleChange} type="password" fullWidth required />
              </Grid>
              {isSignup && (
                <Grid xs={12}>
                  <TextField name="confirmPassword" label="Repeat Password" onChange={handleChange} type="password" fullWidth required />
                </Grid>
              )}
            </Grid>
            
            <Button 
              type="submit" 
              fullWidth 
              variant="contained" 
              sx={{ mt: 3, mb: 2, py: 1.2, fontWeight: 'bold' }}
            >
              {isSignup ? 'Sign Up' : 'Sign In'}
            </Button>

            <Grid container justifyContent="center">
              <Button onClick={handleToggle} sx={{ textTransform: 'none' }}>
                {isSignup ? "Already have an account? Sign In" : "New here? Sign Up"}
              </Button>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AuthPage;