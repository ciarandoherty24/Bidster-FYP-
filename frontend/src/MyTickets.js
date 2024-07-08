import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from './Auth/AuthContext';
import { Container, Card, CardContent, Typography, Grid, CssBaseline, CardMedia, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

function UserTickets() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${currentUser.UserID}/tickets`);
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    if (currentUser?.UserID) {
      fetchTickets();
    }
  }, [currentUser]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <CssBaseline />
      <Typography variant="h4" gutterBottom>Your Tickets</Typography>
      <Grid container spacing={4}> 
        {tickets.map((ticket) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={ticket.ticket_id}> 
            <Card raised sx={{ 
                height: '100%',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                padding: 2, 
                "&:hover": {
                  transform: "scale(1.53)", 
                  transition: "transform 0.3s ease-in-out",
                }
              }}>
              <CardContent sx={{ flexGrow: 1 }}> 
                <Typography gutterBottom variant="h5" component="div">
                  {ticket.event_name}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <EventIcon sx={{ mr: 1 }} /> Date: {new Date(ticket.event_date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOnIcon sx={{ mr: 1 }} /> Location: {ticket.event_location}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AttachMoneyIcon sx={{ mr: 1 }} /> Price Paid: €{ticket.price_paid}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ConfirmationNumberIcon sx={{ mr: 1 }} /> Reference Number: {ticket.ticket_id}
                </Typography>
              </CardContent>
              {ticket.QRCODE && <CardMedia component="img" image={ticket.QRCODE} alt="QR Code" sx={{ width: 'auto', maxHeight: '100px', margin: '0 auto', paddingBottom: '16px' }} />}
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default UserTickets;
