import {Box, Container} from "@mui/material";
import {useState} from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import {Outlet} from "react-router-dom";

const Layout = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        console.log(drawerOpen);
        setDrawerOpen(!drawerOpen);
    };

    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100svh"
        }}>
            <Header toggleDrawer={toggleDrawer}/>
            <Sidebar open={drawerOpen} toggleDrawer={toggleDrawer}/>
            <Box sx={{
                height: '100%',
                maxHeight: '100%',
                overflow: "auto",
                padding: '10px',
                boxSizing: "border-box"
            }}>
                <Outlet/>
            </Box>

            {/* Footer - Luôn cố định dưới cùng */}
            <Footer/>
        </Box>);
};

export default Layout;
