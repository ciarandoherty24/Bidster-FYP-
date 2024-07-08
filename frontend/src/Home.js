import React from "react";
import { Box, Card, CardContent, CardMedia, CssBaseline, Grid, Typography } from "@mui/material";
import { styled } from '@mui/system';

const Hover = styled(Card)({
  transition: "transform 0.15s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)"
  },
  height: "100%",
  display: 'flex',
  flexDirection: 'column',
});

function Home() {
  return (
    <>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'black', padding: 2 }}>
        <Box
          sx={{
            backgroundImage: 'url(/eventBackground.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '80vh',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '24px'
          }}
        >
          <Typography variant="h2" color={'white'} fontFamily={'cursive'} fontWeight={"bold"} gutterBottom>Welcome to Bidster!</Typography>
          <Typography variant="body1" color={'white'} fontFamily={'cursive'} fontWeight={"bold"} fontSize={60}>
            Welcome to a new era of ticket purchasing with our Blind Dutch Auction system, where the power to shape ticket prices is in your hands. Here’s the exciting part: the final ticket cost is determined by collective demand, not by a fixed price.
          </Typography>
        </Box>

        <Typography variant="h4" align="center" color={"white"} gutterBottom sx={{ mt: 4 }}>
          How it Works:
        </Typography>

        <Grid container justifyContent="center" spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
              <Hover sx={{height:'100%'}} >
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="240" 
                  image="/PlaceBidGraphic.webp"
                  alt="placebid"
                  sx={{ objectFit: 'cover' }}
                  
                  
                />
                <CardContent>
                  <Typography variant="h4" gutterBottom>Place a Bid:</Typography>
                  <Typography variant="h5" paragraph>Bid the maximum amount you're willing to pay per ticket.</Typography>
                </CardContent>
              </Card>
              </Hover>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
            <Hover sx={{height:'100%'}} >
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="/payment.webp"
                  alt="payment"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h4" gutterBottom>Submit your Bid:</Typography>
                  <Typography variant="h5" paragraph>Once you place your bids, we'll place a temporary hold on your payment method for the total amount you're on the hook for. Only when the auction is completed and we determine if you've won or lost will we then finalize the payment.</Typography>
                </CardContent>
              </Card>
              </Hover>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
            <Hover sx={{height:'100%'}} >
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="/hammer.webp" 
                  alt="hammer"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h4" gutterBottom>Auction Ends:</Typography>
                  <Typography variant="h5" paragraph>When the auction ends, we match the highest bids with the number of tickets available. The lowest of these bids then sets the price for every bid above it. So every single winner pays the same price even if they bid higher.</Typography>
                </CardContent>
              </Card>
              </Hover>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
            <Hover sx={{height:'100%'}} >
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="240"
                  image="notification.webp" 
                  alt="notification"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h4" gutterBottom>Win or Lose, we will Notify you</Typography>
                  <Typography  variant="h5" paragraph>We will notify you whether you've won or lost the auction.</Typography>
                </CardContent>
              </Card>
            </Hover>
            </Grid>

        </Grid>
      </Box>
    </>
  );
}

export default Home;
