import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Grid, Typography, Paper, Avatar, LinearProgress, Chip } from '@mui/material';
import { Rating } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from '../booking/booking.reducer';
import { styled } from '@mui/system';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CancelIcon from '@mui/icons-material/Cancel';

const BookingDetailContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const BookingDetailItem = ({ label, value }) => (
    <Grid container item xs={6} spacing={1}>
        <Grid item xs={6}>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {label}
            </Typography>
        </Grid>
        <Grid item xs={6}>
            {label === 'Status' ? (
                <Grid container spacing={1} alignItems="center">
                    {value === 'ACCEPTED' && (
                        <Grid item>
                            <CheckCircleOutlineIcon color="success" />
                        </Grid>
                    )}
                    {value === 'APPROVING' && (
                        <Grid item>
                            <HourglassEmptyIcon color="warning" />
                        </Grid>
                    )}
                    {value === 'REJECTED' && (
                        <Grid item>
                            <ThumbDownAltIcon color="error" />
                        </Grid>
                    )}
                    {value === 'SUCCESS' && (
                        <Grid item>
                            <ThumbUpAltIcon color="success" />
                        </Grid>
                    )}
                    {value === 'CANCEL' && (
                        <Grid item>
                            <CancelIcon color="error" />
                        </Grid>
                    )}
                    <Grid item>
                        <Typography variant="body1">{value}</Typography>
                    </Grid>
                </Grid>
            ) : (
                <Typography variant="body1">{value}</Typography>
            )}
        </Grid>
    </Grid>
);

const BookingTracking = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams<'id'>();

    useEffect(() => {
        dispatch(getEntity(id));
    }, [dispatch, id]);

    const bookingEntity = useAppSelector(state => state.booking.entity);

    const isApproving = bookingEntity.status === 'APPROVING';
    const isSuccess = bookingEntity.status === 'SUCCESS';
    console.log(bookingEntity);

    const handleCancel = () => {
        // Add logic to handle cancellation here
        // You may dispatch an action or perform an API call
        // based on your application's architecture
    };

    const handlePayment = () => {
        // Add logic to handle payment here
        // You may navigate to a payment page or perform other actions
        // based on your application's architecture
    };

    return (
        <BookingDetailContainer>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h5">Booking Tracking</Typography>
                </Grid>
                <Grid item xs={12}>


                    <Paper elevation={3} style={{ padding: '16px' }}>
                        <Grid container spacing={3}>
                            <BookingDetailItem label="ID" value={bookingEntity.id} />
                            <BookingDetailItem label="Customer Name" value={bookingEntity.customerName} />
                            <BookingDetailItem label="Book Time" value={bookingEntity.bookTime} />
                            <BookingDetailItem label="Start Time" value={bookingEntity.startTime} />
                            <BookingDetailItem label="End Time" value={bookingEntity.endTime} />
                            <BookingDetailItem label="Total Price" value={bookingEntity.totalPrice} />

                            <BookingDetailItem label="Status" value={<Chip label={bookingEntity.status} />} />


                            <BookingDetailItem label="Rating" value={<Rating value={bookingEntity.rating || 0} readOnly />} />
                            <BookingDetailItem label="Comment" value={bookingEntity.comment} />
                            <BookingDetailItem label="Room" value={bookingEntity.room ? bookingEntity.room.id : ''} />
                            <BookingDetailItem label="User" value={bookingEntity.user ? bookingEntity.user.id : ''} />
                        </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    {isSuccess && (
                        <Grid container item xs={6} spacing={1}>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={6}>
                                <Button onClick={handlePayment} color="primary" variant="contained">
                                    Payment
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                    {isApproving && (
                        <Grid container item xs={6} spacing={1}>
                            <Grid item xs={6}></Grid>
                            <Grid item xs={6}>
                                <Button onClick={handleCancel} color="error" variant="contained">
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                   
                </Grid>
            </Grid>
        </BookingDetailContainer>
    );
};

export default BookingTracking;
