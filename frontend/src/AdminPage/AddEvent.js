import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import axios from 'axios';
function AddEvent() {
  //HOOK FOR STORING DATA
   const [eventData, setEventData] = useState({
      eventName: '',
      eventDesc: '',
      eventDate: '',
      eventLocation:'',
      eventURL:'',
      eventCapacity:'',
      minimumPrice: '',
      auctionStartTime: '',
      auctionEndTime: '',
      eventType: '',
    });
    //NAV HOOK
    const navigate = useNavigate();

    //Handles change in fields
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEventData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    //handles form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        await axios.post('http://localhost:3001/addevent',eventData);
        alert("Event Added Successfully");
        navigate('/admin');
      }catch(error){
        console.error('Error adding Event:', error.response ? error.response.data : "Unknown Error");
        alert('Failed to Add Event :(');
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
            Add New Event
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
              autoFocus
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
              autoFocus
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

          <Typography component="h2" variant='h6' sx={{ mt: 2 }}>Auction Settings</Typography>
      
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
            id="eventType"
            name= "eventType"
            value={eventData.eventType}
            label="eventType"
            onChange={handleChange}
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
              Add Event
            </Button>
          </Box>
        </Box>
      </Container>
    );
}

export default AddEvent;