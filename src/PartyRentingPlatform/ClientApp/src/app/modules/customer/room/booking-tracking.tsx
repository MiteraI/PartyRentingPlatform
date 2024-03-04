import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Grid, Typography, Paper, Avatar, LinearProgress, Chip, Card, Box, Icon, Divider, CardMedia, Container } from '@mui/material';
import { Rating } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import StarIcon from '@mui/icons-material/Star';
import { getEntity } from 'app/entities/booking/booking.reducer';
import { styled } from '@mui/system';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import TimelineItem from 'antd/es/timeline/TimelineItem';
import { Steps, Timeline } from 'antd';
import { Col, Row } from 'reactstrap';
import './requestToBook.scss';
import moment from 'moment';
import { LocalDiningOutlined, SnowmobileOutlined, VerifiedUserOutlined } from '@mui/icons-material';
// import TimelineItem from "examples/Timeline/TimelineItem";

const BookingDetailContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const parallaxImages = [
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/57db1f13-4807-4198-b3a2-2ec5429512e6.jpeg?im_w=960',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/a32e94e7-a54a-4885-92f2-371694082845.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/46be33d4-9ad2-4b22-b9f3-d99bb5d0533d.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',

];

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

    // Ensure bookingEntity and bookingEntity.room are not null or undefined
    const roomEntity = bookingEntity?.room || null;

    const isApproving = bookingEntity?.status === 'APPROVING';
    const isSuccess = bookingEntity?.status === 'SUCCESS';
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

            <Grid item xs={6} md={3} mb={3}>
                <Container style={{ position: 'sticky', top: '150px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '10px' }}>
                    <Row style={{ padding: '20px' }}>
                        <Col md="10" style={{ paddingLeft: '15px' }}>
                            <Typography style={{ height: '60px' }} variant="h4"><strong>Thanks for your booking</strong></Typography>
                            <Typography style={{ color: '#938A88' }} variant="subtitle1"><strong>your booking has been recieved</strong></Typography>

                        </Col>

                        <Col md="2" style={{ display: 'flex' }}>
                            {isApproving && (<Button
                                style={{ margin: 'auto', color: 'white', backgroundColor: '#dd1062', height: '48px', width: '100%', borderColor: '#dd1062', borderRadius: '10px', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <strong>Back Home</strong>
                            </Button>)}
                        </Col>
                    </Row>



                </Container>
            </Grid>

            <Grid item xs={6} md={3}>
                <Container style={{ position: 'sticky', top: '150px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '10px' }}>
                    <div className="booking-info" style={{ padding: '30px' }}>
                        <div className="room-detail-content" >
                            <Row style={{ paddingBottom: '20px' }}>
                                <Col md="4" style={{ paddingLeft: '15px' }}>
                                    <CardMedia className='img-room' image={parallaxImages[0]} />
                                </Col>

                                <Col md="6" style={{ padding: '30px' }}>
                                    <Typography style={{ height: '60px' }} variant="h6"><strong>{roomEntity?.roomName}</strong></Typography>
                                    <Typography variant="subtitle1">{roomEntity?.address}</Typography>
                                    {/* <Typography variant="subtitle2">{roomEntity?.description}</Typography> */}
                                    <div style={{ display: 'flex', alignItems: 'left' }}>
                                        <StarIcon style={{ height: '20px', color: 'gold' }} />
                                        <Typography variant="subtitle2" style={{ marginLeft: '2px' }}><strong>{roomEntity?.rating || 0}</strong></Typography>
                                    </div>
                                    <Divider style={{ marginBottom: '20px', marginTop: '20px', backgroundColor: '#000', opacity: 0.18 }} />
                                    {/* <Typography variant="subtitle2" align='center'>{bookingEntity.customerName}</Typography> */}

                                </Col>
                            </Row>
                        </div>


                        <Divider style={{ marginBottom: '20px', backgroundColor: '#000', opacity: 0.18 }} />


                        <Row>
                            <h4>Check-in information</h4>

                            <Row>
                                {/* <Typography variant="subtitle2">{bookingEntity.customerName}</Typography> */}


                                <Col md="6" style={{ marginTop: '15px' }}>
                                    <Typography variant="subtitle1">Customer Name: </Typography>
                                    <Typography variant="subtitle1">Start time: </Typography>
                                    <Typography variant="subtitle1">End time: </Typography>

                                    {/* {numberOfHours > 0 && (
                                        <div className="room-detail-header">
                                            <Typography variant="subtitle2">{"VNĐ " + bookingEntity.price + " x " + numberOfHours + " giờ"}</Typography>
                                        </div>
                                    )}

                                    {serviceFee > 0 && (<div className="room-detail-header">
                                        <Typography variant="subtitle2">Phí dịch vụ</Typography>
                                    </div>)} */}
                                </Col>


                                <Col md="4" style={{ marginLeft: 'auto', marginTop: '15px' }}>
                                    <Typography variant="subtitle1" style={{ textAlign: 'end' }}><strong>{bookingEntity.customerName}</strong></Typography>
                                    <Typography variant="subtitle1" style={{ textAlign: 'end' }}>{moment(bookingEntity.startTime).format('YYYY-MM-DD HH:mm')}</Typography>
                                    <Typography variant="subtitle1" style={{ textAlign: 'end' }}>{moment(bookingEntity.endTime).format('YYYY-MM-DD HH:mm')}</Typography>
                                    {/* {numberOfHours > 0 && (
                                        <div className="room-detail-header">
                                            <Typography style={{ textAlign: 'end' }} variant="subtitle2">{"VNĐ " + roomEntity.price * numberOfHours}</Typography>
                                        </div>
                                    )}
                                    {serviceFee > 0 && (
                                        <div className="room-detail-header">
                                            <Typography style={{ textAlign: 'end' }} variant="subtitle2">{"VNĐ " + serviceFee}</Typography>
                                        </div>
                                    )} */}
                                </Col>
                            </Row>

                            <Divider style={{ marginBottom: '20px', marginTop: '20px', backgroundColor: '#000', opacity: 0.18 }} />
                            <Row>

                                <Col md="6">
                                    <div className="room-detail-header">
                                        <Typography variant="subtitle1"><strong>Total (VNĐ)</strong></Typography>
                                    </div>
                                </Col>

                                <Col md="4" style={{ marginLeft: 'auto' }}>
                                    <div className="room-detail-header">
                                        {/* <Typography style={{ textAlign: 'end' }} variant="subtitle2"><strong>{"VNĐ " + (bookingEntity.price * numberOfHours + serviceFee)}</strong></Typography> */}
                                    </div>
                                </Col>
                            </Row>

                            <Col md="6">
                                <div className="room-detail-header">
                                    <Typography variant="subtitle2">{"VNĐ " + bookingEntity.price + " x 2 ngày"}</Typography>
                                </div>
                                <div className="room-detail-header">
                                    <Typography variant="subtitle2">Phí dịch vụ</Typography>
                                </div>
                            </Col>

                            <Col md="4" style={{ marginLeft: 'auto' }}>
                                <div className="room-detail-header">
                                    <Typography style={{ textAlign: 'end' }} variant="subtitle2">{"VNĐ " + bookingEntity.price * 2}</Typography>
                                </div>
                                <div className="room-detail-header">
                                    <Typography style={{ textAlign: 'end' }} variant="subtitle2">{"VNĐ " + 100.000}</Typography>
                                </div>
                            </Col>
                        </Row>

                        <Divider style={{ marginBottom: '20px', marginTop: '20px', backgroundColor: '#000', opacity: 0.18 }} />
                        <Row>

                            <Col md="6">
                                <div className="room-detail-header">
                                    <Typography variant="subtitle1"><strong>Total (VNĐ)</strong></Typography>
                                </div>
                            </Col>

                            <Col md="4" style={{ marginLeft: 'auto' }}>
                                <div className="room-detail-header">
                                    <Typography style={{ textAlign: 'end' }} variant="subtitle2"><strong>{"VNĐ " + bookingEntity.price * 2}</strong></Typography>
                                </div>
                            </Col>
                        </Row>

                    </div>
                </Container>
            </Grid>

            <Grid item xs={6} md={3} mt={3}>
                <Container style={{ position: 'sticky', top: '150px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '10px' }}>

                    <Row style={{ padding: '20px' }}>
                        <Col md="10" style={{ paddingLeft: '15px' }}>
                            <Typography style={{ height: '60px' }} variant="h4"><strong>Booking tracking</strong></Typography>
                            {/* <Typography style={{ color: '#938A88' }} variant="subtitle1"><strong>your booking has been recieved</strong></Typography> */}

                        </Col>

                        <Col md="2" style={{ display: 'flex' }}>
                            {isApproving && (<Button
                                style={{ margin: 'auto', color: 'white', backgroundColor: '#dd1062', height: '48px', width: '100%', borderColor: '#dd1062', borderRadius: '10px', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <strong>Cancel</strong>
                            </Button>)}
                        </Col>
                    </Row>
                    <Row style={{ padding: '20px', paddingTop: '0px' }}>
                        <Box>
                            <Steps
                                items={[
                                    {
                                        title: 'Login',
                                        status: 'finish',
                                        icon: <VerifiedUserOutlined />,
                                    },
                                    {
                                        title: 'Verification',
                                        status: 'finish',
                                        icon: <LocalDiningOutlined />,
                                    },
                                    {
                                        title: 'Pay',
                                        status: 'process',
                                        icon: <LocalDiningOutlined />,
                                    },
                                    {
                                        title: 'Done',
                                        status: 'wait',
                                        icon: <SnowmobileOutlined />,
                                    },
                                ]}
                            />
                        </Box>

                    </Row>



                </Container>
            </Grid>

            
        </BookingDetailContainer>






    );


};

export default BookingTracking;