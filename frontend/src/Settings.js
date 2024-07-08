import React, { useState } from 'react';
import { Container, Typography, Grid, TextField, Button, CssBaseline } from '@mui/material';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';

function Settings() {
    const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    username: currentUser.Username,
    email: currentUser.Email,
    firstName: currentUser.FirstName, 
    lastName: currentUser.LastName, 
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSettings(prevState => ({
        ...prevState,
        [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.put(`http://localhost:3001/settings/${currentUser.UserID}/edit`, settings);
        alert('Details Updated Successfully');
    } catch (error) {
        console.error("Failed to update user details:", error);
        alert("Failed to update user details. Please try again.");
    }
  };

  return (
    <Container maxWidth="md">
      <CssBaseline />
      <Typography variant="h4" sx={{ textAlign: 'center', my: 4 }}>Update Details</Typography>
      <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={settings.username}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="firstName"
                            value={settings.firstName}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="lastName"
                            value={settings.lastName}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            variant="outlined"
                            type="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Save Changes
                        </Button>
                    </Grid>
                </Grid>
            </form>
    </Container>
  );
}

export default Settings;
