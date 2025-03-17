import React from 'react';
import {Box, Typography} from '@mui/material';

const Footer = () => {
    return (<Box
        sx={{
            backgroundColor: '#333',
            color: 'white',
            padding: '10px 20px',
            bottom: 0,
            textAlign: 'center',
            marginTop: 'auto'
        }}
    >
        <Typography variant="body2">©2025 SPDM</Typography>
    </Box>);
};

export default Footer;
