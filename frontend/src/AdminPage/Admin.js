import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Container, Box, Typography, Button, Paper, CssBaseline } from '@mui/material';
import { Link } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Admin = () => {
    //state hook for storing data
    const [events, setEvents] = useState([]);

    //useEffect hook for fetching event data
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                //axios to get event data
                const response = await axios.get('http://localhost:3001/allEvents');
                //set events state to fetched data
                setEvents(response.data);
            } catch (error) {
                console.error("There was an error fetching the events:", error);
            }
        };
        fetchEvents();
    }, []);

    //handle delete 
    const handleDelete = async (event_id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this event?");
        if (!isConfirmed) {
            return;
        }
        console.log(`Attempting to delete event with id: ${event_id}`);
        try {
            //Axios to send delete request
            const response = await axios.delete(`http://localhost:3001/events/${event_id}`);
            console.log('Server response:', response.data);
            window.alert('Successfully Delteted Event, bids & Auctions with Event_Id');
    
            if (response.status !== 200) {
                throw new Error('Failed to delete the event.');
            }
            ///update events state to remove delted one
            setEvents(events.filter(event => event.event_id !== event_id));
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete the event.");
        }
    };
    

    return (
        <Container sx={{ mt: 4 }}>
            <CssBaseline/>
            <Paper elevation={3} sx={{ p: 2, mb: 4, backgroundColor: '#f5f5f5' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" color="primary">My Events</Typography>
                    <Button variant="contained" color="secondary" component={Link} to="/addevent" startIcon={<EditIcon />}>
                        Add Event
                    </Button>
                </Box>
                <List>
                    {events.map((event) => (
                        <ListItem 
                            key={event.event_id} 
                            secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="edit" component={Link} to={`/events/edit/${event.event_id}`} sx={{ mr: 1 }}>
                                        <EditIcon color="info" />
                                    </IconButton>
                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(event.event_id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </>
                            }
                            sx={{ borderBottom: '1px solid #e0e0e0' }}
                        >
                            <ListItemText 
                                primary={event.event_name} 
                                secondary={`Date: ${event.event_date}`} 
                                primaryTypographyProps={{ fontWeight: 'medium' }} 
                            />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default Admin;

