import React, { useState } from 'react';
import { Button, Paper, Grid, Typography, Container, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp } from '../../api';

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data } = isSignup ? await signUp(formData) : await signIn(formData);
    localStorage.setItem('profile', JSON.stringify(data));
    navigate('/posts');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8, borderRadius: '15px' }} elevation={6}>
        <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {isSignup && <Grid item xs={12}><TextField name="name" label="Name" fullWidth onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></Grid>}
            <Grid item xs={12}><TextField name="email" label="Email Address" type="email" fullWidth onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></Grid>
            <Grid item xs={12}><TextField name="password" label="Password" type="password" fullWidth onChange={(e) => setFormData({ ...formData, password: e.target.value })} /></Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 3, mb: 2 }}>{isSignup ? 'Sign Up' : 'Sign In'}</Button>
          <Button onClick={() => setIsSignup(!isSignup)} fullWidth>
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;