import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Grid, Typography, Paper, Avatar, LinearProgress, Chip, Card, Box, Icon, Divider, CardMedia, Container } from '@mui/material';
import { Rating } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import StarIcon from '@mui/icons-material/Star';
import { confirmBookingForCustomer, getEntityForCustomer } from 'app/entities/booking/booking.reducer';
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
import AddTaskOutlinedIcon from '@mui/icons-material/AddTaskOutlined';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { LocalDiningOutlined, SnowmobileOutlined, VerifiedUserOutlined } from '@mui/icons-material';
import { AddTaskOutlined as WaitingIcon, DoneOutlined as AcceptedIcon, LocalDiningOutlined as ServingIcon, PaymentOutlined as PaymentIcon } from '@mui/icons-material';

import { ClockCircleOutlined, CheckOutlined, CloseCircleOutlined, DollarCircleOutlined, SmileOutlined } from '@ant-design/icons';

const { Step } = Steps;

import { cancelBookingForCustomer } from 'app/entities/booking/booking.reducer';
import { formatCurrency } from 'app/shared/util/currency-utils';
import dayjs from 'dayjs';
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

function getCurrentStepIndex(status) {
    switch (status) {
        case 'APPROVING':
            return 0;
        case 'ACCEPTED':
            return 1;
        case 'SUCCESS':
            return 3;
        case 'CANCEL':
            return 4;
        case 'REJECTED':
            return 5;
        default:
            return 2;
    }
}


function getStatus(currentStatus, targetStatus) {
    if (getCurrentStepIndex(currentStatus) > getCurrentStepIndex(targetStatus)) {
        return 'finish';
    }
    if ((currentStatus === targetStatus)) {
        return 'finish';
    } else if (currentStatus === 'REJECTED' && targetStatus === 'ACCEPTED') {
        return 'error';
    } else {
        return 'wait';
    }
}



const BookingTracking = () => {
    const dispatch = useAppDispatch();
    const { id } = useParams<'id'>();
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getEntityForCustomer(id));
    }, [dispatch, id]);

    const bookingEntity = useAppSelector(state => state.booking.entity);

    // Ensure bookingEntity and bookingEntity.room are not null or undefined
    const roomEntity = bookingEntity?.room || null;
    const serviceList = bookingEntity?.bookingDetails?.map((bookingDetail) => ({
        id: bookingDetail.service.id,
        name: bookingDetail.service.serviceName,
        price: bookingDetail.service.price,
        description: bookingDetail.service.description,
        quantity: bookingDetail.serviceQuantity,
    }));

    const [serviceFee, setServiceFee] = useState<number>(0);
    const [numberOfHours, setNumberOfHours] = useState<number>(0);

    const isApproving = bookingEntity?.status === 'APPROVING';
    const isSuccess = bookingEntity?.status === 'SUCCESS';
    const isCancel = bookingEntity?.status === 'CANCEL';
    const isAccepted = bookingEntity?.status === 'ACCEPTED';


    useEffect(() => {
        const startDateTmp = new Date(bookingEntity?.startTime);
        const endDateTmp = new Date(bookingEntity?.endTime);

        // Kiểm tra nếu startDate và endDate là đối tượng Date hợp lệ
        if (!isNaN(startDateTmp.getTime()) && !isNaN(endDateTmp.getTime())) {
            const timeDifferenceInMilliseconds = endDateTmp.getTime() - startDateTmp.getTime();
            const numberOfHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

            setNumberOfHours(numberOfHours);
        } else {
            console.error('Invalid date format');
        }


    }, [bookingEntity, roomEntity]);

    useEffect(() => {
        let totalFee = 0;
        serviceList?.map((selectedService) => {
            totalFee += selectedService.quantity * selectedService.price;
        }

        );
        setServiceFee(totalFee);

    }, [bookingEntity, roomEntity]);

    const handleCancel = () => {

        dispatch(cancelBookingForCustomer(id));
    };

    const handleBackHome = () => {
        navigate("/")
    }

    const handleConfirm = () => {
        dispatch(confirmBookingForCustomer(id))
    }

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
                            {isAccepted && (<Typography style={{ color: '#e51d51' }} variant="subtitle1"><strong>your booking is ready now</strong></Typography>)}

                        </Col>

                        <Col md="2" style={{ display: 'flex' }}>
                            {isApproving && (
                                <Button

                                    onClick={handleBackHome}
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

                        <h4>Service</h4>
                        {serviceList?.map((service, index) => (
                            <>
                                <Grid
                                    key={index}
                                    item
                                    xs={12}
                                    container
                                    spacing={1}
                                    alignItems="center"
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Grid item xs={10}>
                                        <Typography style={{ display: 'inline-block' }} variant="subtitle1" fontWeight="bold">
                                            {service.name}
                                        </Typography>
                                        <Typography style={{ display: 'inline-block', color: 'white' }} variant="subtitle1" fontWeight="bold">
                                            {'_'}
                                        </Typography>
                                        <Typography style={{ display: 'inline-block', color: '#BCBAC2' }} variant="subtitle1" fontWeight="bold">
                                            {' x   ' + service.quantity}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            style={{
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                color: '#b4b4b4'
                                            }}
                                        >
                                            {'  '}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} container justifyContent="flex-end">
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ margin: '0 10px' }}>{formatCurrency(service.price)}</span>
                                        </div>
                                    </Grid>
                                </Grid>
                            </>
                        ))}


                        <Divider style={{ marginTop: '20px', marginBottom: '20px', backgroundColor: '#000', opacity: 0.18 }} />


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
                                            <Typography variant="subtitle2">{"VNĐ " + bookingEntity.price + " x " + numberOfHours + " hour"}</Typography>
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
                            <h4>Price details</h4>
                            <Row>

                                {/* <Col md="6">
                                    <div className="room-detail-header">
                                        <Typography variant="subtitle1"><strong>Total (VNĐ)</strong></Typography>
                                    </div>
                                </Col> */}

                                <Col md="4" style={{ marginLeft: 'auto' }}>
                                    <div className="room-detail-header">
                                        {/* <Typography style={{ textAlign: 'end' }} variant="subtitle2"><strong>{"VNĐ " + (bookingEntity.price * numberOfHours + serviceFee)}</strong></Typography> */}
                                    </div>
                                </Col>
                            </Row>

                            <Col md="6" style={{ marginTop: '15px' }}>
                                {numberOfHours > 0 && (
                                    <div className="room-detail-header">
                                        <Typography variant="subtitle2">{formatCurrency(roomEntity.price) + " x " + numberOfHours + " hour"}</Typography>
                                    </div>
                                )}

                                {serviceFee > 0 && (<div className="room-detail-header">
                                    <Typography variant="subtitle2">Service fee</Typography>
                                </div>)}
                            </Col>


                            <Col md="4" style={{ marginLeft: 'auto', marginTop: '15px' }}>
                                {numberOfHours > 0 && (
                                    <div className="room-detail-header">
                                        <Typography style={{ textAlign: 'end' }} variant="subtitle2">{formatCurrency(roomEntity.price * numberOfHours)}</Typography>
                                    </div>
                                )}
                                {serviceFee > 0 && (
                                    <div className="room-detail-header">
                                        <Typography style={{ textAlign: 'end' }} variant="subtitle2">{formatCurrency(serviceFee)}</Typography>
                                    </div>
                                )}
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
                                    <Typography style={{ textAlign: 'end' }} variant="subtitle2"><strong>{formatCurrency(roomEntity?.price * numberOfHours + serviceFee)}</strong></Typography>
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
                                onClick={handleCancel}
                            >
                                <strong>Cancel</strong>
                            </Button>)}

                            {isAccepted && dayjs() >= dayjs(`${bookingEntity?.startTime}`) && (<Button
                                style={{ margin: 'auto', color: 'white', backgroundColor: '#dd1062', height: '48px', width: '100%', borderColor: '#dd1062', borderRadius: '10px', justifyContent: 'center', alignItems: 'center' }}
                                onClick={handleConfirm}
                            >
                                <strong>Confirm</strong>
                            </Button>)}
                        </Col>
                    </Row>

                    <Row style={{ padding: '20px', paddingTop: '0px' }}>
                        <Steps current={getCurrentStepIndex(bookingEntity?.status)} status="process">
                            <Step
                                title="Waiting"
                                icon={<ClockCircleOutlined />}
                                // description={<Typography variant="body2">Waiting for approval</Typography>}
                                status={getStatus(bookingEntity?.status, 'APPROVING')}
                            />
                            <Step
                                title="Accepted"
                                icon={<CheckOutlined />}
                                // description={<Typography variant="body2">Your booking has been accepted</Typography>}
                                status={getStatus(bookingEntity?.status, 'ACCEPTED')}
                            />
                            <Step
                                title="Serving"
                                icon={<SmileOutlined />}
                                // description={<Typography variant="body2">You are currently being served</Typography>}
                                status={getStatus(bookingEntity?.status, 'ACCEPTED')}
                            />

                            {isApproving && <Step
                                title={"Payment"}
                                icon={<DollarCircleOutlined />}

                                // description={<Typography variant="body2">Payment completed</Typography>}
                                status={getStatus(bookingEntity?.status, 'SUCCESS')}
                            />}

                            {isAccepted && <Step
                                title={"Payment"}
                                icon={<DollarCircleOutlined />}

                                // description={<Typography variant="body2">Payment completed</Typography>}
                                status={getStatus(bookingEntity?.status, 'SUCCESS')}
                            />}

                            {isSuccess && <Step
                                title={"Payment"}
                                icon={<DollarCircleOutlined />}

                                // description={<Typography variant="body2">Payment completed</Typography>}
                                status={getStatus(bookingEntity?.status, 'SUCCESS')}
                            />}

                            {isCancel && <Step
                                title={"Cancel"}
                                icon={<DollarCircleOutlined style={{ color: "red" }} />}

                                // description={<Typography variant="body2">Payment completed</Typography>}
                                status={getStatus(bookingEntity?.status, 'CANCEL')}
                            />}




                        </Steps>
                    </Row>



                </Container>
            </Grid>


        </BookingDetailContainer>






    );


};

export default BookingTracking;
