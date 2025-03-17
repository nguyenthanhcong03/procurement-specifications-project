import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Divider,
    ListItemButton,
    ListItemIcon,
} from '@mui/material';
import {Link} from 'react-router-dom';
import {FolderCopy, Person, UploadFile} from '@mui/icons-material';
import {isAdmin} from "../utils/constant.js";

const Sidebar = ({open, toggleDrawer}) => {
    return (
        <Drawer
            anchor="left"
            open={open}
            onClose={toggleDrawer}
            sx={{
                width: 250,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 250,
                    boxSizing: 'border-box',
                    backgroundColor: '#f5f5f5', // Light background for the sidebar
                    borderRight: '1px solid rgba(0, 0, 0, 0.12)', // Subtle border
                },
            }}
            ModalProps={{
                keepMounted: false, // Improve performance for mobile
            }}
        >
            <div
                role="presentation"
                onClick={toggleDrawer}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') toggleDrawer();
                }}
            >
                <List>
                    {/* Upload Section */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/"
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#e0e0e0', // Hover effect
                                },
                            }}
                        >
                            <ListItemIcon sx={{color: 'primary.main'}}>
                                <UploadFile/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Upload"
                                primaryTypographyProps={{fontWeight: 'medium'}} // Bold text
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* Process Section */}
                    <ListItem disablePadding>
                        <ListItemButton
                            component={Link}
                            to="/process"
                            sx={{
                                '&:hover': {
                                    backgroundColor: '#e0e0e0', // Hover effect
                                },
                            }}
                        >
                            <ListItemIcon sx={{color: 'primary.main'}}>
                                <FolderCopy/>
                            </ListItemIcon>
                            <ListItemText
                                primary="Process"
                                primaryTypographyProps={{fontWeight: 'medium'}} // Bold text
                            />
                        </ListItemButton>
                    </ListItem>

                    {/* User Section */}
                    {isAdmin() && (<ListItem disablePadding>
                            <ListItemButton
                                component={Link}
                                to="/users"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: '#e0e0e0', // Hover effect
                                    },
                                }}
                            >
                                <ListItemIcon sx={{color: 'primary.main'}}>
                                    <Person/>
                                </ListItemIcon>
                                <ListItemText
                                    primary="User"
                                    primaryTypographyProps={{fontWeight: 'medium'}} // Bold text
                                />
                            </ListItemButton>
                        </ListItem>
                    )}

                    {/* Add more list items as needed */}
                </List>
                <Divider sx={{borderColor: 'rgba(0, 0, 0, 0.12)'}}/> {/* Subtle divider */}
            </div>
        </Drawer>
    );
};

export default Sidebar;