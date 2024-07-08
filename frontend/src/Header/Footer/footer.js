import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ width: '100%', background: 'linear-gradient(to right, #4204d1, #9c0599)', mt: 4 }} component="footer">
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" color={"white"} fontStyle={'italic'} gutterBottom>
          Bidmaster
        </Typography>
        <Typography variant="subtitle1" align="center" color="white" fontStyle={'italic'} component="p">
        ©2024
        </Typography>
      </Container>
    </Box>
  );
};
export default Footer;
