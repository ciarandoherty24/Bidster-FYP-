import React from 'react';
import {Typography, Container, CssBaseline } from '@mui/material';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';

const ComingSoon = () => {
  return (
    <Container maxWidth='lg'>
      <CssBaseline></CssBaseline>
      <Typography variant='h1' sx={{textAlign: 'center'}}>Theatre Coming Soon</Typography>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <TheaterComedyIcon style={{fontSize:200}}  ></TheaterComedyIcon>
      </div>
    </Container>
    );
};
export default ComingSoon;