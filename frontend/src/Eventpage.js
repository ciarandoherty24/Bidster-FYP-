import React, { useState, useEffect } from 'react';
import {Container,Box,Typography,TextField,Button,Paper,Grid,CardMedia,Tab,Tabs,CssBaseline,List,ListItem,ListItemText,ListItemIcon,Avatar} from '@mui/material';
import { green, red, blue } from '@mui/material/colors';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
import Countdown from './Countdown';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useParams} from 'react-router-dom';
import { Store } from 'react-notifications-component';

function Eventpage() {
  const {currentUser} = useAuth();
  const [event,setEvent]=useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const[bidQuantity,setBidQuantity] = useState(1);
  const [auctionResults, setAuctionResults] = useState([]);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [minPrice,setMinPrice] = useState(null);
 
  const [finalPrice,setFinalPrice] = useState(null);
  const { event_id } = useParams();
 
  useEffect(() => {
    // Get event details
    const fetchEventDetails = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3001/events/${event_id}`);
        setEvent(data);
        setMinPrice(data.min_price);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [event_id]);

  //place bid function
  const placeBid = async () => {
    try {
      const bidValue = parseFloat(bidAmount);
      //if no bid entered
      if (!bidValue || bidValue <= 0) {
        //alert('Please enter a valid bid amount.');
        Store.addNotification({
          title: "No Amount Entered",
          message: `Enter Max Amount you are willing to pay per Ticket`,
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
        return;
      }
      //if Quantity is 0 or less
      if (!bidQuantity || bidQuantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
      }
      //if Quantity exceeds 4
      if(bidQuantity>4){
        //alert ('Max Quantity is 4!');
        Store.addNotification({
          title: "Max 4 Tickets per order!",
          message: "Please choose 4 or less",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
        return;
      }
      //if Bid is less than min price
      if(bidValue<minPrice){
        Store.addNotification({
          title: "Bid Too Low",
          message: "Place Higher Bid!",
          type: "danger",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
        return;
      }
      //if user is not logged in
      if (!currentUser || !currentUser.UserID) {
        //alert('Please log in.');
        Store.addNotification({
          title: "Not Logged In",
          message: "Please Log in to place your Bid",
          type: "warning",
          insert: "top",
          container: "top-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 2000,
            onScreen: true
          }
        });
        return;
      }
      //post bid database
      await axios.post(`http://localhost:3001/events/${event_id}/bid`, {
        UserID: currentUser.UserID,
        //event_id: event_id,
        bidAmount: bidValue,
        quantity: bidQuantity, 
      });
      //alert('Bid placed successfully!');
      setBidAmount('');
      setBidQuantity(1);
      //On screen pop-up notificaion
      Store.addNotification({
        title: "Bid Placed Successfully!",
        message: `Bid Amount: €${bidAmount} | Quantity: ${bidQuantity} tickets`,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 2000,
          onScreen: true
        }
      });
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid.');
    }
  };
  
  useEffect(()=>{
    //fetch auction details
    const auctionDetails = async () =>{
      try{
        await axios.get(`http://localhost:3001/auctions/${event_id}`);
      }catch(error){
        console.error("Error fetching auction details: ",error);
      }
    }
    auctionDetails();
    auctionResult();
  },[event_id,currentUser]);
  
//get auction end results
  const auctionResult = async () => {
    try {
        const response = await axios.get(`http://localhost:3001/events/${event_id}/auctionResults`);
        const data = response.data;
        setIsAuctionEnded(data.isAuctionEnded);

        if(data.isAuctionEnded){
            setAuctionResults(data.auctionResults || []);
            setFinalPrice(data.auctionResults[0].ClearingPrice);
            
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.error('Error fetching auction results:', error);
    }
};

  //hook for selected Tabs 
  const [selectedTab, setSelectedTab] = useState(0);
  //function for changing tabs
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


  
  return (
    <Container maxWidth="lg">
      <CssBaseline />
      <Paper elevation={3} sx={{ my: 4, p: 2 }}>
        <Grid container spacing={2}>
          {/* Event Description */}
          <Grid item xs={12} md={7}>
            <Box sx={{ my: 2, p: 2, backgroundColor: blue[50] }}>
              <Typography variant="h5" color={blue[900]}>
                {event?.event_name || 'Event Name'}
              </Typography>
              <CardMedia
                image={event?.image_url || 'default_image.png'}
                alt={event?.name || 'Event'}
                sx={{ height: 240, width: '100%', backgroundSize: 'contain', my: 2 }}
              />
              <Typography variant="subtitle1" sx={{ mt: 2 }}>
                {event?.event_location || 'Location'} |{' '}
                {event ? new Date(event.event_date).toLocaleDateString() : 'Date/Time'}
              </Typography>
            </Box>
          </Grid>

          {/* Bid Form */}
          <Grid item xs={12} md={5}>
          <Box sx={{ my: 2, p: 2, backgroundColor: blue[50] }}>
            <Typography variant="body1" gutterBottom>
              Place your bid
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Max Bid per ticket"
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  variant="outlined"
                  fullWidth
                  disabled={isAuctionEnded}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Quantity"
                  type="number"
                  value={bidQuantity}
                  onChange={(e) => setBidQuantity(e.target.value)}
                  InputProps={{
                    inputProps: { 
                      min: 1 ,
                      max: 4
                    }
                  }}
                  variant="outlined"
                  fullWidth
                  disabled={isAuctionEnded}
                />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={placeBid}
              sx={{ mt: 2 }}
              disabled={isAuctionEnded}
            >
              Place Bid
            </Button>
          </Box>

            {/* Timer */}
            <Box sx={{ my: 2, p: 2, backgroundColor: blue[50] }}>
              <Typography variant="h5">Time Remaining</Typography>
              <Countdown end_time={event?.end_time}  />
            </Box>
          </Grid>

          {/* Top Bids */}
         {isAuctionEnded && (
            <Grid item xs={12}>
              <Box sx={{ my: 2, p: 2, backgroundColor: blue[50] }}>
                <Typography variant="h5">Auction Results:</Typography>
                <Typography variant="h5">Final Price: €{finalPrice}</Typography>
                <List>
                {auctionResults && auctionResults.length > 0 ? (
    auctionResults.map((bid, index) => (
      <ListItem key={index}>
        <ListItemIcon>
        {/* Check the result of each bid*/}
          {bid.result === 1 ? ( 
            <Avatar sx={{ bgcolor: green[500] }}> 
              <CheckCircleIcon />
            </Avatar>
          ) : (
            <Avatar sx={{ bgcolor: red[500] }}>
              <HighlightOffIcon />
            </Avatar>
          )}
        </ListItemIcon>
        <ListItemText
          primary={`${index + 1}. ${bid.Username}: €${bid.bid_amount}`}
          primaryTypographyProps={{
            fontWeight: bid.result === 1 ? 'bold' : 'normal', // make winning bids font bold
          }}
        />
      </ListItem>
    ))
) : (
  <Typography>No Bids Placed</Typography>
)}

                </List>
              </Box>
            </Grid>
)}

          {/* Details Tabs */}
          <Grid item xs={12}>
            <Paper square>
              <Tabs
                value={selectedTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
                aria-label="disabled tabs example"
              >
                <Tab label="Details" />
                <Tab label="Auction Info" />
                <Tab label="Terms & Conditions" />
              </Tabs>
              <Box sx={{ my: 2, p: 2, backgroundColor: blue[50], mt: 4 }}>
                {selectedTab === 0 && (
                  <Typography>{event?.description || 'Event description goes here...'}</Typography>
                )}
                {selectedTab === 1 && (
                  <Typography>Our Blind Dutch Auction system offers a unique twist to ticket purchasing. Here's how it works: ticket prices start high and gradually decrease over time. However, there's a catch – the current price remains a mystery. You submit the price you're willing to pay, and if it matches or exceeds the hidden auction price at any point, the ticket is yours at that lower rate. This method ensures fairness and adds a thrilling layer of anticipation. Whether you're aiming for concerts, sports, or theater tickets, mastering this auction can land you incredible deals. Happy bidding, and may the odds be in your favor!</Typography>
                )}
                {selectedTab === 2 && (
                  <Typography> By engaging with our auction, you agree to these terms, which include important details about the bidding process, payment methods, ticket allocation, and our cancellation policy. We encourage you to read these terms carefully to ensure a transparent and fair auction experience. Remember, your participation signifies your understanding and acceptance of these conditions. Our aim is to provide a seamless and enjoyable process for securing tickets to your favorite events, and adhering to these T&Cs helps us maintain integrity and fairness for all users. Thank you for choosing us for your event ticketing needs!
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Eventpage;