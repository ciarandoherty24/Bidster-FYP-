import React from 'react';
import {Typography, Container, CssBaseline } from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const Sports = () => {
  return (
    <Container maxWidth='lg'>
        <CssBaseline></CssBaseline>
      <Typography variant='h1' sx={{textAlign: 'center'}}>Sports Coming Soon</Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
     <SportsSoccerIcon style={{fontSize:200}}></SportsSoccerIcon>
      </div>
    </Container>
    );
};
export default Sports;