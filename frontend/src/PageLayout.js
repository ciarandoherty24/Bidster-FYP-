import React from "react";
import Header from "./Header/Footer/header";
import Footer from "./Header/Footer/footer";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const PageLayout = () => {

    //This Function is used to Wrap the pages with the Header and footer consistently using the <Outlet/> from React Router Dom
    return(
        <>
        <Box sx={{display:'flex',flexDirection:'column', minHeight:'100vh'} }>
            <Header/>
        <Box component='main' sx={{flexGrow:1 }}>
            <Outlet/>
        </Box>
            <Footer/>
        </Box>
        
        </>
    )
}

export default PageLayout;
