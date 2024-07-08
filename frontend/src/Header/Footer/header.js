import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
//import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';

import axios from 'axios';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [unreadNotifications,setUnreadNotifications] = useState(0);
  const notificationsOpen = Boolean(notificationAnchorEl);
  const [notifications, setNotifications] = useState([]);
  const open = Boolean(anchorEl);
  const { currentUser } = useAuth();
  const {logout} = useAuth();
  const navigate = useNavigate();
  
  //check if current user is admin
  const isAdmin = () =>{
     return currentUser && currentUser.Role === 'admin';
  } 
  //Effect hook for fetch Users Notification
  useEffect(() => {
    let intervalId;
    const fetchNotifications = async (UserID) => {
      try {
        const response = await axios.get(`http://localhost:3001/user/${UserID}/notifications`);
        setNotifications(response.data);
        const unreadCount = response.data.filter(notification => notification.status === 'unread').length;
        setUnreadNotifications(unreadCount);
      } catch (error) {
        console.error('Error Fetching Users Notifications:', error);
      }
    };
    if (currentUser && currentUser.UserID) {
      // Fetch notifications
      fetchNotifications(currentUser.UserID);
  
      // interval for fetching notifications
      intervalId = setInterval(() => {
        fetchNotifications(currentUser.UserID);
      }, 30000); // refresh every 30secs
    }
  
    // Clear the interval
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentUser]);

  //function to mark notifications as read
  const markNotificationsAsRead = async () => {
    try {
      const unreadNotificationIDs = notifications
        .filter(notification => notification.status === 'unread')
        .map(notification => notification.notification_id);
  
      if (unreadNotificationIDs.length > 0) {
        await axios.put(`http://localhost:3001/user/${currentUser.UserID}/notifications/markasread`, {
          notificationIds: unreadNotificationIDs
        });
  
        setNotifications(notifications => notifications.map(notification => ({
          ...notification,
          status: unreadNotificationIDs.includes(notification.notification_id) ? 'read' : notification.status
        })));
  
        setUnreadNotifications(0);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };
  
  //Notificaion Icon Menu Anchor
  const handleNotificationMenu = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  //Handle closing of notifications
  const handleNotificationClose = () => {
    //set unread to 0
    setUnreadNotifications(0);
    //set anchor to closed
    setNotificationAnchorEl(null);
    //mark the notifications as read
    markNotificationsAsRead();
    //naviage to tickets if clicked
    navigate(`/mytickets`);
  };
  
  //ProfileIcon Anchor 
  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  //Close function
  const handleClose = () => {
    setAnchorEl(null);
  };
  //function for logging out
  const handleLogOut = () =>{
    logout();
    navigate('/login');
  }

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(to right, #4204d1,#9c0599)' }}>
      <Toolbar>
        <IconButton component={Link} to="/" edge="start" color="inherit" aria-label="home">
          <HomeIcon />
        </IconButton>
        <Button component={Link} to="/music" sx={{flexGrow:1}} style={{color:'white'}}>Music</Button>
        <Button component={Link} to="/sport" sx={{flexGrow:1}}style={{color:'white'}}>Sport</Button>
        <Typography variant="h5" sx={{ flexGrow: 1 }} style={{ textAlign: 'center' }}>
          Bidster
        </Typography>
        <Button component={Link} to="/cinema" sx={{flexGrow:1}} style={{color:'white'}}>Cinema</Button>
       
        <Button component={Link} to="/arts&theatre" sx={{flexGrow:1}} style={{color:'white'}}>Arts & Theatre</Button>
        {currentUser ? (
          <div>
            {/*NoficationMenu*/}
            <IconButton
              size='large'
              aria-label='show notfications'
              color='inherit'
              onClick={handleNotificationMenu}
            >
              <Badge badgeContent={unreadNotifications} color="error">
                <NotificationsIcon/>
              </Badge>

            </IconButton>
            <Menu
              id="menu-notification"
              anchorEl={notificationAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical:'top',
                horizontal:'right',
              }}
              open={notificationsOpen}
              onClose={() => setNotificationAnchorEl(null)} 
              >
                {notifications.map((notification, index)=>(
                <MenuItem key={index} onClick={()=> handleNotificationClose()}>
                 {notification.title} - {notification.message}
                </MenuItem>
              ))
              }
              </Menu>
            {/*ProfileMenu*/ }
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={Link} to="/myprofile">Profile</MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/mytickets">My Tickets</MenuItem>
              {isAdmin() && <MenuItem onClick={handleClose} component={Link} to="/admin">Admin</MenuItem> } 
              <MenuItem onClick={handleClose} component={Link} to="/settings"> Settings</MenuItem>
              <MenuItem onClick={handleLogOut}>Logout</MenuItem>
    
            </Menu>
          </div>
        ):(
          <Button color='inherit' component={Link} to='/login'>Log In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Header;