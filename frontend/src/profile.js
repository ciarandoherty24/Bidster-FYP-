import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext'; 
import {Card,TableContainer,Table,TableHead,TableBody,TableCell, Container, Typography, Paper, Box, Grid, Avatar, CssBaseline, Button, TableRow } from '@mui/material';
import { Link} from 'react-router-dom'; 


const MyProfile = () => {
    const { currentUser } = useAuth();
    const [bids, setBids] = useState([]);

    //Get all Users Bids
    useEffect(() => {
        if (currentUser) {
            axios.get(`http://localhost:3001/user/${currentUser.UserID}/bids`)
                .then(response => {
                    setBids(response.data);
                })
                .catch(error => {
                    console.error('Error fetching bids', error);
                });
        }
    }, [currentUser]);
    //if not logged in
    if (!currentUser) {
        return <Typography>Please Log in</Typography>
    }


    return (
        <Container component="main" maxWidth="lg">
        <CssBaseline/>
        <Box  component={Paper} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                {currentUser.FirstName[0]}
            </Avatar>
            <Typography component="h1" variant="h5">
                My Profile
            </Typography>
            <Card variant="outlined" sx={{ mt: 3, p: 2, width: '100%' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1"><b>Name:</b> {currentUser.FirstName} {currentUser.LastName}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1"><b>Username:</b> {currentUser.Username}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1"><b>Email:</b> {currentUser.Email}</Typography>
                    </Grid>
                </Grid>
            </Card>
            
        </Box>
    
        <Box mt={4} mb={2} >
            <Typography variant="h4" gutterBottom >
                My Bid History
            </Typography>
            {bids.length > 0 ? (

                <TableContainer component={Paper} elevation={12} >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><h2>Event</h2></TableCell>
                                <TableCell align="right"><h2>Bid Amount</h2></TableCell>
                                <TableCell align="right"><h2>Status</h2></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {bids.map((bid) => (
                                <TableRow key={bid.event_id}>
                                    <TableCell component="th" scope="row">
                                        {bid.event_name}
                                    </TableCell>
                                    <TableCell align="right">${bid.bid_amount}</TableCell>
                                    <TableCell align="right">{bid.result}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            component={Link}
                                            to={`/eventpage/${bid.event_id}`}
                                        >
                                            Go to Event
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="subtitle1">No bids placed yet.</Typography>
            )}
        </Box>
    </Container>
    
    );
};

export default MyProfile;

