import React from 'react';
import { Box, Typography, Link, Grid } from '@mui/material';

export function Footer() {
  return (
    <Box sx={{ backgroundColor: '#1976d2', color: 'white', padding: 3, marginTop: 4 }}>
      <Grid container justifyContent="space-between">
        {/* Links Section */}
        <Grid item xs={12} md={6}>
          <Typography variant="body1">
            <Link href="/home" color="inherit" sx={{ textDecoration: 'none', marginRight: 2 }}>
              Home
            </Link>
            <Link href="/services" color="inherit" sx={{ textDecoration: 'none', marginRight: 2 }}>
              Services
            </Link>
            <Link href="/contact" color="inherit" sx={{ textDecoration: 'none', marginRight: 2 }}>
              Contact
            </Link>
            <Link href="/about" color="inherit" sx={{ textDecoration: 'none' }}>
              About Us
            </Link>
          </Typography>
        </Grid>

        {/* Copyright Section */}
        <Grid item xs={12} md={6} textAlign="right">
          <Typography variant="body2">
            Made with ❤️ by Our Bank. © {new Date().getFullYear()} All rights reserved.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
