import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Box, TextField, Typography, Container, CssBaseline, Select,MenuItem } from '@mui/material';
import axios from 'axios';

function EditEvent() {
    //State hook for storing event data
    const [eventData, setEventData] = useState({
        eventName: '',
        eventDesc: '',
        eventCapacity:'',
        eventDate: '',
        eventLocation: '',
        eventURL: '',
        minimumPrice: '',
        auctionStartTime: '',
        auctionEndTime: '',
        eventType:'',
    });
    //get id from url
    const { event_id } = useParams();
    const navigate = useNavigate();
  
    //useEffect to Get the Values that are already in the event data
    useEffect(() => {
        const fetchEventData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/events/${event_id}`);
                const { data } = response;
                setEventData({
                    eventName: data.event_name,
                    eventDesc: data.description, 
                    eventCapacity: data.event_capacity,
                    eventDate: data.event_date,
                    eventLocation: data.event_location,
                    eventURL: data.image_url,
                    eventapacity: data.event_capacity,
                    eventType : data.event_type,
                    minimumPrice: data.min_price,
                    auctionStartTime: data.start_time,
                    auctionEndTime: data.end_time,

                });
            } catch (error) {
                console.error("Failed to fetch event data:", error);
            }
        };

        fetchEventData();
    }, [event_id]);
    //Handle changes in form fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEventData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    //handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:3001/events/${event_id}`, eventData);
            //on successfull submission navigate back to admin page.
            navigate('/admin');
        } catch (error) {
            console.error("Failed to update event:", error);
            alert("Failed to update event. Please try again.");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Edit Event
                </Typography>
                <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="eventName"
                        label="Event Name"
                        name="eventName"
                        autoFocus
                        value={eventData.eventName}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="eventLocation"
                        label="Event Location"
                        name="eventLocation"
                        value={eventData.eventLocation}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="eventURL"
                        label="Image URL"
                        name="eventURL"
                        value={eventData.eventURL}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="eventDate"
                        label="Event Date"
                        type="date"
                        id="eventDate"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={eventData.eventDate}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="eventDesc"
                        label="Event Description"
                        id="eventDesc"
                        multiline
                        rows={4}
                        value={eventData.eventDesc}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="eventCapacity"
                        label="Event Capacity"
                        id="eventCapacity"
                        type='number'
                        value={eventData.eventCapacity}
                        onChange={handleChange}
                     />
                    <Typography component="h2" variant="h6" sx={{ mt: 2 }}>Auction Settings</Typography>
                
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="minimumPrice"
                        label="Minimum Price"
                        name="minimumPrice"
                        type="number"
                        value={eventData.minimumPrice}
                        onChange={handleChange}
                    />
                 
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="auctionStartTime"
                        label="Auction Start Time"
                        name="auctionStartTime"
                        type="datetime-local"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={eventData.auctionStartTime}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="auctionEndTime"
                        label="Auction End Time"
                        name="auctionEndTime"
                        type="datetime-local"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={eventData.auctionEndTime}
                        onChange={handleChange}
                    />
                              <Typography>event type</Typography>
                    <Select
                        labelId="eventType"
                        required
                        id="eventType"
                        name='eventType'
                        value={eventData.eventType}
                        label="eventType"
                        onChange={handleChange}
                        fullWidth
                    >
                        <MenuItem value={'music'}>music</MenuItem>
                        <MenuItem value={'cinema'}>cinema</MenuItem>
                    </Select>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Update Event
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}

export default EditEvent;
