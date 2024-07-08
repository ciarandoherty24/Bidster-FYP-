import React from "react";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
//countdown timer
function Countdown({ end_time , CountdownEnd }) {

    //useState Hook
    const [timeLeft, setTimeLeft] = useState('');
    
    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date();
        const end = new Date(end_time);
        const difference = end - now;
  
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
  
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } 
        if(difference<=0){
            setTimeLeft('Auction Ended!');
            clearInterval(interval);
            if(CountdownEnd){
              CountdownEnd();
            } 
        
        }
      }, 1000);
  
      return () => clearInterval(interval);
    }, [end_time, CountdownEnd]);
  
    return <Typography>{timeLeft}</Typography>;
  }

  export default Countdown