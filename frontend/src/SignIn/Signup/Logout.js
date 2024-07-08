import React from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { Button } from '@mui/material';

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); 
  };

  return (
    <Button onClick={handleLogout} color="inherit">Logout</Button>
  );
};

export default LogoutButton;
