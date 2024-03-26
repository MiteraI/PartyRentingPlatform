import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Divider, Typography, Grid, Container } from '@mui/material';
import { styled } from '@mui/system';
import Modal from 'react-modal';
import type { Styles as ReactModalStyles } from 'react-modal';
import { DatePicker, TimePicker } from 'antd';
// import 'antd/dist/antd.css';



import { Parallax } from 'react-parallax';
import { useNavigate } from 'react-router-dom';
import { faShareAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntityForCustomer as getEntity } from 'app/entities/room/room.reducer';
import { getEntities as getServiceEntities } from 'app/entities/service/service.reducer';

import './room-detail.scss';


import moment from "moment";
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';
import { range } from 'lodash';
import { formatCurrency } from 'app/shared/util/currency-utils';
import { IRoom } from 'app/shared/model/room.model';


// import "@vf-alchemy/vattenfall-design-system/scss/main.scss";


const StyledRoomDetail = styled('div')(({ theme }) => ({
    padding: '30px', // Default padding for larger screens
    paddingTop: '0',
    [theme.breakpoints.down('sm')]: {
        padding: '15px', // Adjust padding for smaller screens
    },
}));

const modalStyles: ReactModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const RoomDetailForCustomer = () => {

    const [quantityMap, setQuantityMap] = useState<{ [key: string]: number }>({});
    const dispatch = useAppDispatch();
    const { id } = useParams<'id'>();
    const [currentPage, setCurrentPage] = useState(0);
    // Xử lý date picker
    const [startDate, setStartDate] = React.useState(null);
    const [endDate, setEndDate] = React.useState(null);

    const [startTime, setStartTime] = useState(null); // Declare startTime state
    const [endTime, setEndTime] = useState(null); // Declare endTime state
    // Thêm state để theo dõi lỗi
    const [error, setError] = useState<string | null>(null);

    const handleBookClick = () => {
        // Reset previous errors
        setError(null);

        // Check if startTime, endTime, and startDate are not null before formatting
        if (startTime && endTime && startDate) {
            // Validate date: must be at least 3 days from the current date
            const currentDate = new Date();
            const minimumStartDate = new Date();
            minimumStartDate.setDate(currentDate.getDate() + 3);

            if (startDate < minimumStartDate) {
                setError("Selected date must be at least 3 days from the current date.");
                return;
            }

            // Validate startTime and endTime
            const minimumTimeDifference = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
            const startDateTime = new Date(startDate.format('YYYY-MM-DD') + ' ' + startTime.format('HH:mm:ss')).getTime();
            const endDateTime = new Date(startDate.format('YYYY-MM-DD') + ' ' + endTime.format('HH:mm:ss')).getTime();

            if (endDateTime - startDateTime < minimumTimeDifference) {
                setError("The time difference between startTime and endTime must be at least 2 hours.");
                return;
            }

            // Continue with the rest of the code

            const formattedStartTime = startDate.format('YYYY-MM-DD') + ' ' + startTime.format('HH:mm:ss');
            const formattedEndTime = startDate.format('YYYY-MM-DD') + ' ' + endTime.format('HH:mm:ss');
            const selectedServicesArray = Object.keys(quantityMap).map(serviceId => ({
                id: serviceId,
                quantity: quantityMap[serviceId],
            }));

            const queryString = `startDate=${formattedStartTime}&endDate=${formattedEndTime}&selectedService=${JSON.stringify(selectedServicesArray)}`;

            navigate(`/room/request-to-book/${roomEntity.id}?${queryString}`);
        } else {
            // Handle the case when startTime, endTime, or startDate is null
            setError("Start time, end time, and date must be selected.");
        }
    };

    const [focusedInput, setFocusedInput] = React.useState(null);
    const [selectedService, setSelectedService] = useState(null); // Track selected service
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // Thêm state để lưu trữ tổng giá trị phí dịch vụ
    const [serviceFee, setServiceFee] = useState<number>(0);
    const [numberOfHours, setNumberOfHours] = useState<number>(0);

    useEffect(() => {
        dispatch(getEntity(id));
    }, [dispatch, id]);



    // useEffect(() => {
    //     dispatch(getServiceEntities({ page: currentPage, size: 10, sort: 'id,asc' }));
    // }, [dispatch]);



    const roomEntity = useAppSelector((state) => state.room.entity) as IRoom;
    const serviceList = roomEntity.services || [];

    useEffect(() => {
        // Kiểm tra xem roomEntity đã được tải chưa
        if (!roomEntity.id) {
            // Nếu chưa, thực hiện yêu cầu API để lấy chi tiết phòng
            dispatch(getEntity(id));
        }
    }, [dispatch, id, roomEntity]);

    useEffect(() => {
        // Kiểm tra xem roomEntity và danh sách dịch vụ đã được tải chưa
        if (roomEntity.id && !roomEntity.services) {
            // Nếu chưa, thực hiện yêu cầu API để lấy danh sách dịch vụ
            // Lưu ý: Điều này giả sử có một hàm API khác để lấy danh sách dịch vụ
            // Bạn có thể thay thế nó bằng hàm tương ứng trong ứng dụng của bạn
            dispatch(getServiceEntities({ page: currentPage, size: 10, sort: 'id,asc' }));
        }
    }, [dispatch, currentPage, roomEntity]);

    useEffect(() => {

        const totalServiceFee = Object.keys(quantityMap).reduce((total, serviceId) => {
            const service = serviceList.find(service => service.id == Number(serviceId));
            if (service) {
                return total + (service.price * quantityMap[serviceId]);
            }
            return total;
        }, 0);

        // Cập nhật state serviceFee
        setServiceFee(totalServiceFee);
    }, [quantityMap, serviceList]);

    useEffect(() => {
        const hours = (endTime - startTime) / 3600000;
        if (hours > 0) { setNumberOfHours(hours) };
    }, [startTime, endTime, startDate]);


    const parallaxImages = [
        'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/57db1f13-4807-4198-b3a2-2ec5429512e6.jpeg?im_w=960',
        'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/a32e94e7-a54a-4885-92f2-371694082845.jpeg?im_w=720',
        'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/46be33d4-9ad2-4b22-b9f3-d99bb5d0533d.jpeg?im_w=720',
        'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',
        'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',
    ];

    const navigate = useNavigate();


    const openModal = (service) => {
        setSelectedService(service);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setSelectedService(null); // Reset selectedService when closing the modal
        setModalIsOpen(false);
    };

    const handleIncrementQuantity = (serviceId: string | number) => {
        setQuantityMap((prevMap) => ({
            ...prevMap,
            [serviceId]: (prevMap[serviceId] || 0) + 1,
        }));
    };


    // Function to decrement quantity for a specific service
    const handleDecrementQuantity = (serviceId: string) => {
        setQuantityMap((prevMap) => ({
            ...prevMap,
            [serviceId]: Math.max((prevMap[serviceId] || 0) - 1, 0),
        }));
    };

    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        const today = dayjs().endOf('day');
        const threeDaysAfter = today.add(3, 'day')
        return current && current < threeDaysAfter;
    };

    const disabledRangeTime: RangePickerProps['disabledTime'] = (_, type) => {
        if (type === 'start') {
            return {
                disabledHours: () => range(0, 8),
                disabledMinutes: () => range(1, 60),
                disabledSeconds: () => range(1, 60),
            };
        }
        return {
            disabledHours: () => range(0, 8),
            disabledMinutes: () => range(1, 60),
            disabledSeconds: () => range(1, 60),
        };
    };
    return (
        <StyledRoomDetail>
            <Grid container spacing={3} mb={2}>
                <Grid item md={6}>
                    <div className="room-detail-header">
                        <h3>{roomEntity.roomName}</h3>
                    </div>
                </Grid>
                <Grid item md={6} container justifyContent="flex-end" alignItems="center">
                    <Button
                        color="primary"
                        style={{
                            marginRight: '10px',
                            border: 'none',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'black',
                        }}
                    >
                        <FontAwesomeIcon icon={faShareAlt} style={{ marginRight: '5px' }} /> Share
                    </Button>
                    <Button
                        color="primary"
                        style={{
                            border: 'none',
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            color: 'black',
                        }}
                    >
                        <FontAwesomeIcon icon={faHeart} style={{ marginRight: '5px' }} /> Save
                    </Button>
                </Grid>
            </Grid>



            {/* Custom layout for room images */}
            <div className="room-detail-header" style={{ height: '300px', overflow: 'hidden', borderRadius: '10px' }}>
                <Row style={{ height: '300px', overflow: 'hidden' }}>
                    <Col md="6" style={{ height: '100%', overflow: 'hidden', paddingRight: '10px' }}>
                        <img src={roomEntity?.imageURLs?.length > 0 ? roomEntity?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg"} alt={`Room Image 0`} className="full-width" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </Col>
                    <Col md="6" style={{ height: '100%', overflow: 'hidden' }}>
                        <Row style={{ height: '100%', overflow: 'hidden' }}>
                            <Col md="6" style={{ height: '100%', overflow: 'hidden', padding: '0', paddingRight: '10px' }}>
                                <img src={roomEntity?.imageURLs?.length > 0 ? roomEntity?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg"} alt={`Room Image 1`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover', paddingBottom: '10px' }} />
                                <img src={roomEntity?.imageURLs?.length > 0 ? roomEntity?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg"} alt={`Room Image 3`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
                            </Col>
                            <Col md="6" style={{ height: '100%', overflow: 'hidden', padding: '0', paddingRight: '5px' }}>
                                <img src={roomEntity?.imageURLs?.length > 0 ? roomEntity?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg"} alt={`Room Image 2`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover', paddingBottom: '10px' }} />
                                <img src={roomEntity?.imageURLs?.length > 0 ? roomEntity?.imageURLs[0]?.imageUrl : "https://storage.googleapis.com/digital-platform/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e/chiem_nguong_20_mau_biet_thu_dep_sang_trong_bac_nhat_so_2_18ef110d5e.jpg"} alt={`Room Image 4`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>

            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={8} pr={8}>
                    <div className="room-detail-header">
                        <h4>{roomEntity.roomName}</h4>
                        <Typography mb={3} variant="subtitle1">{roomEntity.address}</Typography>
                    </div>
                    <Divider style={{ marginBottom: '20px', marginTop: '20px', backgroundColor: '#000', opacity: 0.1 }} />



                    <Grid container spacing={3} mb={3}>
                        <Grid item xs={12} md={8}>
                            <div className="host-info" style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar
                                    src={roomEntity.user?.imageUrl}
                                    alt="Host Avatar"
                                    style={{ width: '50px', height: '50px' }} // Adjust the width and height as needed
                                />
                                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <Typography variant="subtitle1"><strong>{roomEntity.user?.firstName + " " + roomEntity.user?.lastName}</strong></Typography>
                                    <Typography variant="body2">Host party • 10 months hosting</Typography>
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                    <Divider style={{ marginBottom: '24px', backgroundColor: '#000', opacity: 0.1 }} />


                    <Row>
                        <h4>What this place offers</h4>
                        {serviceList.map((service, index) => (
                            <Grid
                                key={index}
                                item
                                xs={12}
                                container
                                spacing={1}
                                alignItems="center"
                                style={{ cursor: 'pointer' }}
                                onClick={() => openModal(service)}
                            >
                                <Grid item xs={10}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {service.serviceName}
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
                                        {service.description}
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} container justifyContent="flex-end">
                                    {/* Quantity controls in room-detail */}
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {quantityMap[service.id] > 0 ? (
                                            <>
                                                <span style={{ margin: '0 10px' }}>{quantityMap[service.id]}</span>
                                                {/* <button onClick={() => handleDecrementQuantity(service.id)}>-</button> */}
                                            </>
                                        ) : (
                                            <button style={{ color: '#dd1062' }} onClick={() => handleIncrementQuantity(service.id)}>+</button>
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                        ))}

                    </Row>




                    <Divider style={{ marginTop: '24px', marginBottom: '24px', backgroundColor: '#000', opacity: 0.1 }} />


                    <Row mt={1}>
                        <p>{roomEntity.description}</p>
                    </Row>

                </Grid>


                <Grid item xs={12} md={4} >
                    <Container style={{ position: 'sticky', top: '100px', padding: '0' }}>
                        <div className="booking-info" style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '10px' }}>
                            <Typography mb={2} variant="h6"><strong>{formatCurrency(roomEntity.price)}</strong> / hour</Typography>
                            <Container style={{ marginBottom: '15px', padding: '0', width: '100%', textAlign: 'center' }}>

                            </Container>

                            <DatePicker
                                type='start'
                                style={{ marginBottom: '16px', width: '100%' }}
                                disabledDate={disabledDate}
                                onChange={(date) => setStartDate(date)}
                                value={startDate}
                                placeholder="Select Date"
                            />

                            {/* Add time pickers for start and end time */}
                            {startDate != null && (
                                <Row>
                                    <Col md="6" >
                                        <TimePicker
                                            style={{ marginBottom: '16px', width: '100%' }}
                                            onChange={(time) => setStartTime(time)}
                                            placeholder="Select Start Time"
                                            disabledTime={disabledRangeTime}
                                        />

                                    </Col>
                                    <Col md="6" >

                                        <TimePicker
                                            style={{ marginBottom: '16px', width: '100%' }}
                                            onChange={(time) => setEndTime(time)}
                                            placeholder="Select End Time"
                                            disabledTime={disabledRangeTime}
                                        />
                                    </Col>
                                </Row>)}

                            {error && (
                                <Typography textAlign={'center'} variant="body2" color="error" style={{ marginTop: '10px' }}>
                                    {error}
                                </Typography>
                            )}

                            <Button
                                color="primary"
                                size="large"
                                data-cy="bookButton"
                                onClick={handleBookClick}

                                style={{ backgroundColor: '#dd1062', height: '48px', width: '100%', borderColor: '#dd1062', borderRadius: '10px', marginBottom: '10px' }}
                            >
                                <strong>Reserve</strong>
                            </Button>
                            <Row>
                                <Typography variant="subtitle2" align='center'>You won't be charged yet</Typography>


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
                                        <Typography style={{ textAlign: 'end' }} variant="subtitle2"><strong>{formatCurrency(roomEntity.price * numberOfHours + serviceFee)}</strong></Typography>
                                    </div>
                                </Col>
                            </Row>
                        </div>

                    </Container>
                </Grid>




            </Grid>


            {/* Modal for displaying service details */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={modalStyles}
                className="custom-modal"
                overlayClassName="custom-overlay"
            >
                {selectedService && (
                    <div>
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h2 style={{ paddingTop: '24px' }}>{selectedService.serviceName}</h2>
                        <p>{selectedService.description}</p>
                        <p>Price: ${selectedService.price}</p>
                        {/* Quantity controls in service popup */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button onClick={() => handleDecrementQuantity(selectedService.id)}>-</button>
                            <span style={{ margin: '0 10px' }}>{quantityMap[selectedService.id] || 0}</span>
                            <button onClick={() => handleIncrementQuantity(selectedService.id)}>+</button>
                        </div>
                    </div>
                )}
            </Modal>
        </StyledRoomDetail>
    );
}


export default RoomDetailForCustomer