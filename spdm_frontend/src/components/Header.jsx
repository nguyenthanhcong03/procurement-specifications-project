import React, {useState} from 'react';
import {AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Avatar, Divider} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {logout} from "../services/authService.js";
import {styled} from '@mui/system';
import {getCurrentUser, getUserName} from "../utils/constant.js";
import {Logout, Password} from "@mui/icons-material";
import PasswordChangePopup from "../pages/user/PasswordChangePopup.jsx";
import {useStore} from "../stores/StoreContext.jsx";
import {observer} from "mobx-react-lite";

const StyledAppBar = styled(AppBar)(({theme}) => ({
    backgroundColor: '#1e1e1e', // Darker background for a modern look
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
    transition: 'background-color 0.3s ease', // Smooth transition for hover effects
}));

const StyledToolbar = styled(Toolbar)(({theme}) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 16px', // Add padding for better spacing
}));

const Header = ({toggleDrawer}) => {
    const {
        isChangePassword,
        setUser,
        handleResetPassword,
        handleChangePasswordStatus
    } = useStore().userStore
    const [anchorEl, setAnchorEl] = useState(null); // To control the menu anchor
    const open = Boolean(anchorEl); // To check if the menu is open

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget); // Set the anchor element to open the menu
    };

    const handleCloseMenu = () => {
        setAnchorEl(null); // Close the menu when the user clicks outside or selects an option
    };

    const handleLogout = () => {
        logout();
        window.location.replace('/login');
        handleCloseMenu(); // Close the menu after logout
    };
    const handleChangePassword = () => {
        setUser(getCurrentUser())
        handleChangePasswordStatus()
    }
    return (
        <StyledAppBar position="sticky">
            <StyledToolbar>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
                    <MenuIcon sx={{fontSize: '2rem'}}/> {/* Larger icon */}
                </IconButton>
                <Typography variant="h6"
                            sx={{flexGrow: 1, textAlign: 'center', fontWeight: 'bold', letterSpacing: '1px'}}>
                    Simulation Process and Data Management
                </Typography>
                <Box className={'cursor-pointer'} display="flex" alignItems="center" onClick={handleMenuClick}
                     sx={{'&:hover': {opacity: 0.8}}}>
                    <Avatar sx={{backgroundColor: '#4caf50', width: 40, height: 40}}> {/* Custom avatar */}
                        <AccountCircleIcon sx={{fontSize: '2rem'}}/> {/* Larger icon */}
                    </Avatar>
                    <Typography variant="body1" color="inherit" sx={{marginLeft: 1, fontWeight: '500'}}>
                        {getUserName()}
                    </Typography>
                </Box>
                <Menu
                    anchorEl={anchorEl} // The menu will be anchored to this element (the account icon)
                    open={open}
                    onClose={handleCloseMenu} // Close the menu when clicked outside
                    PaperProps={{
                        style: {
                            marginTop: '8px', // Add some space between the icon and the menu
                            borderRadius: '8px', // Rounded corners for the menu
                            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Subtle shadow for the menu
                        },
                    }}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{horizontal: 'right', vertical: 'top'}}
                    anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                >
                    <MenuItem onClick={handleChangePassword} sx={{
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        gap: '10px'
                    }}> {/* Styled menu item */}
                        <Password/> Change password
                    </MenuItem>
                    <Divider/>
                    <MenuItem onClick={handleLogout} sx={{
                        padding: '12px 24px',
                        fontSize: '1rem',
                        fontWeight: '500',
                        gap: '10px'
                    }}> {/* Styled menu item */}
                        <Logout/> Logout
                    </MenuItem>
                </Menu>
            </StyledToolbar>
            <PasswordChangePopup open={isChangePassword} handleChangePasswordStatus={handleChangePasswordStatus} handleChangePassword={handleResetPassword} isReset={true}/>
        </StyledAppBar>
    );
};

export default observer(Header);