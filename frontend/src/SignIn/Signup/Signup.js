import React from 'react';
import { Box, TextField, Button, Typography, Avatar, CssBaseline, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterForm = () => {
  //nav hook
  const navigate = useNavigate();

  //handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const formData = {
      username: data.get('username'), 
      email: data.get('email'),
      password: data.get('password'),
      firstname: data.get('firstName'),
      lastname: data.get('lastName'),
    };

    try {
      await axios.post('http://localhost:3001/register',formData);
      window.alert('User Registered Successfully, Now Sign in!')
      navigate('/login');
    
    } catch (error) {
      console.error('Error Registering User:', error);
    }
  };

  return (
    <Grid container component='main' sx={{height:'100vh'}}>
      <CssBaseline/>
      <Grid item xs={false} sm={4} md={7} sx={{ backgroundImage: 'url(/PlaceBidGraphic.webp)',backgroundRepeat: 'no-repeat',}}/>
      {/* Form */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
      <Box
        sx={{
          my:8,
          mx:4,
          display:'flex',
          flexDirection: 'column',
          alignItems:'center',
          height: '100%',
        }}
      >
        <Avatar sx={{m:1, bgcolor:'secondary.main'}}></Avatar>
        <Typography component="h1" variant='h5'>Register</Typography>
        <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link to='/login' variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        

      </Box>
      </Grid>
      </Grid>

  );
};

export default RegisterForm;