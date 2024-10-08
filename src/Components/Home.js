import React from 'react';
import { Grid2, Card, CardMedia, CardContent, Typography,  Accordion, AccordionSummary, AccordionDetails, Box} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import SwipeableViews from 'react-swipeable-views'; // You need to install this package for swipeable views
import { Footer } from './Footer'; // Assuming you have a Footer component already
import bankingImage from '../IMAGES/bankingImage.jpeg';
import bank2 from '../IMAGES/bank2.jpeg';
import bank3 from '../IMAGES/bank3.jpeg';
function Home() {
  const cards = [
    { title: 'Saving & Current Account', description: 'Details about our credit services', image: bankingImage },
    { title: 'Internet Banking', description: 'Learn more about investment options', image: bank2},
    { title: 'Investments', description: 'How to save with our accounts', image: bank3 },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* First Section: Basic Details and Swipeable Cards */}
      <Grid2 container spacing={2} sx={{ padding: 4, backgroundColor: 'lightblue' }}>
        {/* Left Side - Bank details */}
        <Grid2 item xs={12} md={6}>
          <Typography variant="h3" gutterBottom>
            Welcome to Our Hashbank
          </Typography>
          <Typography variant="body1" >
            We provide a range of financial services that help you manage your money efficiently. From saving and investing to borrowing and insuring, we have services tailored to fit your needs.
          </Typography>
          <Typography variant="body1" >
            Explore our secure online banking platform and enjoy hassle-free transactions, investment opportunities, and much more.
          </Typography>
        </Grid2>

        {/* Right Side - Swipeable Cards */}
        <Grid2 sx={{display:'flex' , flexDirection: 'row' , gap: 4 }} item xs={12} md={6}>
            {cards.map((card, index) => (
              <Card key={index} sx={{ marginBottom: 2 }}>
                <CardMedia component="img" height="200" image={card.image} alt={card.title} />
                <CardContent>
                  <Typography variant="h5">{card.title}</Typography>
                  <Typography variant="body2">{card.description}</Typography>
                </CardContent>
              </Card>
            ))}
        </Grid2>
      </Grid2>

      {/* Second Section: FAQ Section with Accordions */}
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Frequently Asked Questions
        </Typography>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How do I open an account?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Opening an account with us is simple! You can apply online or visit your nearest branch.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>What are the interest rates for savings?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Our savings accounts offer competitive interest rates that vary based on account type and balance.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>How can I apply for a loan?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              You can apply for a loan directly through our website or by visiting one of our branches.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Third Section: Footer */}
      <Footer />
    </Box>
  );
}

export default Home;
