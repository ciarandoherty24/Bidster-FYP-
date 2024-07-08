import React from "react";
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import { Container, CssBaseline } from "@mui/material";

function AuthDenied() {
    return(
        <Container maxWidth='lg'>
        <CssBaseline></CssBaseline>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <DoNotDisturbIcon style={{fontSize:200, color:'red'}}  />
        <h1 style={{fontSize:100}}>Authorization Denied</h1>
        </div>
      </Container>
    )
}
export default AuthDenied;