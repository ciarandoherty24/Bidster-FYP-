import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, CardContent, CardMedia, CssBaseline, Grid, Box,Typography, IconButton } from "@mui/material";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';

import Carousel from 'react-material-ui-carousel';
import axios from "axios";
import Countdown from "./Countdown";
import styled from "@emotion/styled";




function Cinemapage() {
  // State for storing events fetched from backend
  const [events, setEvents] = useState([]);
  const [layout,setLayout] = useState('grid');

  const layoutToggle = () =>{
    setLayout(layout === 'grid' ? 'list' : 'grid');
  }

  // Effect hook to fetch event data
  useEffect(() => {
    axios.get('http://localhost:3001/home')
        .then(response => {
            console.log('Response data:', response.data);
            setEvents(response.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}, []);
//hoover animation for cards
const Hover = styled(Card)({
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
});
return (
  <Grid container spacing={4} direction="column">
    <CssBaseline />
    <Grid item xs={12}>
      {/* Carousel for featured events */}
      <Carousel animation="slide" interval={3000}>
  {events.map((event, i) => (
    <Card key={event.id} elevation={3} sx={{ position: 'relative', width:'100%', height:'50vh', backgroundColor:'inherit' }}>
      <CardMedia
        component='img'
        image={event.image_url}
        title="Event art"
        sx={{
          position:'center',
          width: '100%',
          height: '100%',
          objectFit: 'contain' ,
          objectPosition:'top'

        }}
      />
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // transparant background
        color: 'white',
        padding: '20px',
        boxSizing: 'border-box',
        textAlign: 'center'
      }}>
        <Typography gutterBottom variant="h5" component="h2">
          {event.event_name}
        </Typography>
        <Typography variant="body1" component="p">
          {event.description}
        </Typography>
        <Button
          sx={{ marginTop: 2 }}
          variant="contained"
          color="primary"
          component={Link}
          to={`/eventpage/${event.event_id}`}
          state={{ event }}
        >
          Go to Event
        </Button>
      </Box>
    </Card>
  ))}
</Carousel>
    </Grid>
    {/*Layout Toggle */}
    <IconButton onClick={layoutToggle} sx={{ mb: 2, color:'linear-gradient(to right, #4204d1,#9c0599)'}}>
              {layout === 'grid' ? <ViewListIcon/> : <ViewModuleIcon />}
      </IconButton>

    {/* Grid for all events */}
    {layout === 'grid'?(
      <Grid item container spacing={2}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={event.event_id}>
          <Hover sx={{height:'100%'}}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component='img'
              sx={{ height: 240, padding: 1 ,objectFit: 'contain'}}
              image={event.image_url}
              title="Event art"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {event.event_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {event.event_location} | {new Date(event.event_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                  <Countdown end_time = {event.end_time}/>
                  
              </Typography>
              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                color="primary"
                component={Link}
                to={`/eventpage/${event.event_id}`} 
                state={{ event }}
            >
                Go to Event
            </Button>
            </CardContent>
          </Card>
          </Hover>
        </Grid>
      ))}
    </Grid>
    ):(
      <Grid item container spacing={2} direction={"column"}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={event.event_id}>
          <Hover sx={{height:'100%'}}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component='img'
              sx={{ height: 240, padding: 1 ,objectFit: 'contain'}}
              image={event.image_url}
              title="Event art"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {event.event_name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {event.event_location} | {new Date(event.event_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                  <Countdown end_time = {event.end_time}/>
                  
              </Typography>
              <Button
                sx={{ marginTop: 2 }}
                variant="contained"
                color="primary"
                component={Link}
                to={`/eventpage/${event.event_id}`} 
                state={{ event }}
            >
                Go to Event
            </Button>
            </CardContent>
          </Card>
          </Hover>
        </Grid>
      ))}
    </Grid>
    )}
    
  </Grid>

);
}



export default Cinemapage;
