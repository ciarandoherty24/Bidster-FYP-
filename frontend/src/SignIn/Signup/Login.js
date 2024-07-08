import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Avatar, CssBaseline, Grid, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Auth/AuthContext';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:3001/signin', { email, password });
      if (data.user) {
        sessionStorage.setItem('currentUser', JSON.stringify(data.user));
        login(data.user);
        console.log('Sign in successful:', data);
        navigate('/');
      } else {
        console.error('Sign-in was successful, but no user data was returned');
      }
    } catch (error) {
      console.error('Sign-in failed:', error.response ? error.response.data.message : error.message);
      window.alert("Username or Password are incorrect");
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid item xs={12} sm={6} md={6} sx={{
        backgroundImage: 'url(/PlaceBidGraphic.webp)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover', // This ensures the background image covers the entire grid area
        backgroundPosition: 'center', // This centers the background image
      }}/>

      {/* Form */}
      <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}></Avatar>
          <Typography component="h1" variant='h5'>Sign In</Typography>
          <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Button
              color='secondary'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              component={Link} to={'/'}
            >
              Continue as Guest
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to='/users' variant='body2'> Demo User</Link>
              </Grid>
              <Grid item>
                <Link to='/register' variant='body2'>
                {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginForm;
