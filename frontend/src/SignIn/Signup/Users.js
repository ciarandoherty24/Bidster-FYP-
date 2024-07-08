import React, { useState, useEffect } from 'react';
import { Avatar, Button, Box, Grid, CssBaseline, Container, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Auth/AuthContext';

const Users = () => {
    //hooks
    const navigate = useNavigate();
    const { login } = useAuth();
    const [users, setUsers] = useState([]);

    //useEffect to get all User Data
    useEffect(() => {
        axios.get('http://localhost:3001/users')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    //Handle User Login
    const handleUserLogin = (user) => {
        login(user); 
        console.log('Login Successful:', user);
        navigate("/"); 
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Choose an account
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2} justifyContent="center">
                        {users.map((user) => (
                            <Grid item key={user.id} xs={12} sm={6} md={4}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Avatar
                                        alt={user.FirstName}
                                        src={user.avatar}
                                        onClick={() => handleUserLogin(user)}
                                        sx={{ width: 56, height: 56, cursor: 'pointer' }}
                                    />
                                    <Typography variant="subtitle1">{user.FirstName}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
                <Box sx={{ mt: 4, width: '100%' }}>
                    <Button component={Link} to="/login" fullWidth variant="outlined" sx={{ mb: 2 }}>
                        Other User
                    </Button>
                    <Button component={Link} to="/register" fullWidth variant="contained">
                        Make Account
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Users;
