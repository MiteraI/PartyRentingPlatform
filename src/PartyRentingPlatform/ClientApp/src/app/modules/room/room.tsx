import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Paper, Typography, Button, Grid } from '@mui/material';
import { useAppSelector } from 'app/config/store';

// Sample data for room details
const sampleRoomData = {
  id: '1',
  name: 'Cozy Apartment with a View',
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ],
  price: 120,
  description: 'A comfortable apartment with a beautiful view.',
};

const Room = () => {
  const { id } = useParams<{ id: string }>();
  const account = useAppSelector((state) => state.authentication.account);

  // Fetch room details using the room ID (You can replace this with your API call)
  // For now, using the sampleRoomData
  const room = sampleRoomData;

  const handleBookClick = () => {
    // Handle booking logic, for now, just navigate to the booking page
    // You can pass the room information to the booking page using React Router
    // Example: history.push(`/book/${id}`);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h4" gutterBottom>
          {room.name}
        </Typography>

        <Grid container spacing={2}>
          {room.images.map((image, index) => (
            <Grid item key={index} xs={12} md={4}>
              <img src={image} alt={`Room ${index + 1}`} style={{ width: '100%', height: 'auto' }} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
          Price: ${room.price}/ngày
        </Typography>

        <Typography variant="body1" paragraph>
          {room.description}
        </Typography>

        {account?.login ? (
          <Button variant="contained" color="primary" onClick={handleBookClick} sx={{ marginTop: 2 }}>
            Book Now
          </Button>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ marginTop: 2 }}>
            Please{' '}
            <Link to="/login" style={{ color: 'blue' }}>
              log in
            </Link>{' '}
            to book this room.
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default Room;
