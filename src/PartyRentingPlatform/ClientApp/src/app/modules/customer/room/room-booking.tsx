import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, Storage, ValidatedField, ValidatedForm } from 'react-jhipster';
import StarIcon from '@mui/icons-material/Star';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useLocation } from 'react-router-dom';
import moment from 'moment';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { IBooking } from 'app/shared/model/booking.model';
import { updateEntity, createEntityByCustomer, reset } from 'app/entities/booking/booking.reducer';
import { getEntityForCustomer } from 'app/entities/room/room.reducer';
import { Avatar, CardMedia, Container, Divider, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { AxiosResponse } from 'axios';
import './requestToBook.scss';
import { forEach } from 'lodash';


const RoomBookingForCustomer = () => {

  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntityForCustomer(id));
  }, [dispatch, id]);



  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null); // State to hold the created booking
  const [startDateFromUrl, setStartDateFromUrl] = useState<string | null>(null);
  const [endDateFromUrl, setEndDateFromUrl] = useState<string | null>(null);
  const [selectedServiceFromUrl, setSelectedServiceFromUrl] = useState<Array<{ id: string, quantity: string }> | null>(null);
  const [quantityMap, setQuantityMap] = useState(null);
  const [serviceFee, setServiceFee] = useState<number>(0);
  const [numberOfHours, setNumberOfHours] = useState<number>(0);


  const StyledRoomDetail = styled('div')(({ theme }) => ({
    padding: '45px', // Default padding for larger screens
    [theme.breakpoints.down('sm')]: {
      padding: '15px', // Adjust padding for smaller screens
    },
  }));

  const location = useLocation();
  // Lấy giá trị của selectedService từ URL parameter
  const bookingDetailsParam = new URLSearchParams(location.search).get('selectedService');
  
  // Chuyển đổi chuỗi JSON thành mảng JavaScript
  // const bookingDetails = bookingDetailsParam ? JSON.parse(bookingDetailsParam) : [];

  const bookingDetails = bookingDetailsParam
  ? JSON.parse(bookingDetailsParam).map((item) => ({
      serviceId: item.id,
      serviceQuantity: item.quantity,
      // Bạn có thể sao chép các trường khác nếu cần
    }))
  : [];

  const navigate = useNavigate();

  useEffect(() => {
    // Check if createdBookingId is available and redirect
    if (createdBookingId !== null) {
      navigate(`/room/booking-tracking/${createdBookingId}`);
    }
  }, [createdBookingId, navigate]);

  const roomEntity = useAppSelector(state => state.room.entity);
  const serviceList = roomEntity.services || [];
  console.log(new URLSearchParams(location.search).get('selectedService'));

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const startDateParam = params.get('startDate');
    const endDateParam = params.get('endDate');
    const selectedServiceParam = params.get('selectedService');

    setStartDateFromUrl(startDateParam);
    setEndDateFromUrl(endDateParam);

    const startDateTmp = new Date(startDateParam);
    const endDateTmp = new Date(endDateParam);

    // Kiểm tra nếu startDate và endDate là đối tượng Date hợp lệ
    if (!isNaN(startDateTmp.getTime()) && !isNaN(endDateTmp.getTime())) {
      const timeDifferenceInMilliseconds = endDateTmp.getTime() - startDateTmp.getTime();
      const numberOfHours = timeDifferenceInMilliseconds / (1000 * 60 * 60);

      setNumberOfHours(numberOfHours);
    } else {
      console.error('Invalid date format');
    }

    try {
      const parsedSelectedService = JSON.parse(selectedServiceParam || '[]');
      setSelectedServiceFromUrl(parsedSelectedService);
      setQuantityMap(parsedSelectedService);
      console.log(quantityMap);

    } catch (error) {
      console.error('Error parsing Selected Service:', error);
    }
  }, [location.search]);


  useEffect(() => {
    let totalFee = 0;
    selectedServiceFromUrl?.map((selectedService) => {
      let tmp = serviceList?.find(item => item.id === parseInt(selectedService.id))?.price;
      totalFee += tmp * parseInt(selectedService.quantity);
    }

    );
    setServiceFee(totalFee);

  }, [selectedServiceFromUrl, serviceList]);


  const isNew = true;

  const rooms = useAppSelector(state => state.room.entities);
  const bookingEntity = useAppSelector(state => state.booking.entity);
  const loading = useAppSelector(state => state.booking.loading);
  const updating = useAppSelector(state => state.booking.updating);
  const updateSuccess = useAppSelector(state => state.booking.updateSuccess);
  const account = useAppSelector(state => state.authentication.account);

  const parallaxImages = [
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/57db1f13-4807-4198-b3a2-2ec5429512e6.jpeg?im_w=960',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/a32e94e7-a54a-4885-92f2-371694082845.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/46be33d4-9ad2-4b22-b9f3-d99bb5d0533d.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',

  ];

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
    }
  }, [updateSuccess]);


  const saveEntity = async (values) => {
    try {
      if (values.id !== undefined && typeof values.id !== 'number') {
        values.id = Number(values.id);
      }
      values.bookTime = convertDateTimeToServer(values.bookTime);
      values.startTime = convertDateTimeToServer(values.startTime);
      values.endTime = convertDateTimeToServer(values.endTime);
      if (values.totalPrice !== undefined && typeof values.totalPrice !== 'number') {
        values.totalPrice = Number(values.totalPrice);
      }
      if (values.rating !== undefined && typeof values.rating !== 'number') {
        values.rating = Number(values.rating);
      }

      const entity = {
        ...bookingEntity,
        ...values,
        roomId: id,
        // trả về mảng object serviceId, serviceQuantity
        // bookingDetails: [{ "serviceId": 1, "serviceQuantity": 1 }],
        bookingDetails: bookingDetails,

      };

      const createEntityByCustomerAction = await dispatch(createEntityByCustomer(entity));
      const newBookingId = (createEntityByCustomerAction.payload as AxiosResponse<IBooking>)?.data?.id || null;
      // Set the createdBookingId state
      setCreatedBookingId(newBookingId);

    } catch (error) {
      console.error('Error creating booking:', error);
      // Handle the error, display a user-friendly message, or log more details
    }
  };

  const defaultValues = () =>
    isNew
      ? {
        bookTime: displayDefaultDateTime(),
        startTime: convertDateTimeFromServer(startDateFromUrl),
        endTime: convertDateTimeFromServer(endDateFromUrl),
        status: 'APPROVING',
        price: roomEntity.price,
        customerName: Storage.local.get("user"),
      }
      : {
        status: 'APPROVING',
        ...bookingEntity,
        customerName: account?.firstName + " " + account?.lastName,
        bookTime: convertDateTimeFromServer(bookingEntity.bookTime),
        startTime: convertDateTimeFromServer(bookingEntity.startTime),
        endTime: convertDateTimeFromServer(bookingEntity.endTime),
        room: bookingEntity?.room?.id,
        user: bookingEntity?.user?.id,

      };


  return (
    <div>
      <StyledRoomDetail>
        <Grid container spacing={3} mb={2}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Button tag={Link} to={`/room/detail/${id}`} replace color="info" style={{ border: 'none', background: 'none' }}>
                <FontAwesomeIcon icon="arrow-left" />
              </Button>

            </Grid>
            <Grid item md={6}>
              <div className="room-detail-header">
                <h2>Confirm and pay</h2>
              </div>
            </Grid>
          </Grid>

          <Grid item md={6} container justifyContent="flex-end" alignItems="center">
          </Grid>
        </Grid>
        <Grid container spacing={3} mt={1}>
          <Grid item md={7} pr={8}>
            <div className="room-detail-header">
              <h4>Your bill</h4>
              <Typography mb={3} variant="subtitle1">{roomEntity.address}</Typography>
            </div>

            <Grid mb={1} item xs={10}>
              <Typography variant="subtitle1" fontWeight="bold">
                Date
              </Typography>
              <Typography
                variant="body2"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#808080'
                }}
              >
                {moment(startDateFromUrl).format('YYYY-MM-DD')}
              </Typography>
            </Grid>

            <Grid mb={1} item xs={10}>
              <Typography variant="subtitle1" fontWeight="bold">
                Duration
              </Typography>
              <Typography
                variant="body2"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#808080'
                }}
              >
                {moment(startDateFromUrl).format('HH:mm') + " --> " + moment(endDateFromUrl).format('HH:mm')}
              </Typography>
            </Grid>

            <h4>Service: </h4>
            {selectedServiceFromUrl?.map((service, index) => (
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
                    <Typography variant="subtitle1" fontWeight="bold">
                      {serviceList.find(item => item.id === parseInt(service.id))?.serviceName}
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
                      {serviceList.find(item => item.id === parseInt(service.id))?.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={2} container justifyContent="flex-end">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ margin: '0 10px' }}>{quantityMap.find(item => item.id === service.id)?.quantity}</span>
                    </div>
                  </Grid>
                </Grid>
              </>
            ))}

            <Divider style={{ marginBottom: '40px', marginTop: '20px', backgroundColor: '#000', opacity: 0.18 }} />

            <div className="room-detail-header">
              <h4>Fill in your information</h4>
              {/* <Typography mb={3} variant="subtitle1">{roomEntity.address}</Typography> */}
            </div>

            {/* <Row mt={1}>
              <p>{roomEntity.description}</p>
            </Row> */}




            <Row className="justify-content-center">
              <Col md="8">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                    {!isNew ? <ValidatedField name="id" required readOnly id="booking-id" label="ID" validate={{ required: true }} /> : null}
                    <ValidatedField label="Customer Name" id="booking-customerName" name="customerName" data-cy="customerName" type="text" />

                    {/* <ValidatedField
                      label="Start Time"
                      id="booking-startTime"
                      name="startTime"
                      data-cy="startTime"
                      type="datetime-local"
                      placeholder="YYYY-MM-DD HH:mm"
                      validate={{
                        required: { value: true, message: 'This field is required.' },
                      }}
                    />
                    <ValidatedField
                      label="End Time"
                      id="booking-endTime"
                      name="endTime"
                      data-cy="endTime"
                      type="datetime-local"
                      placeholder="YYYY-MM-DD HH:mm"
                      validate={{
                        required: { value: true, message: 'This field is required.' },
                      }}
                    /> */}
                    <Button
                      id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}
                      style={{ backgroundColor: '#dd1062', height: '48px', width: '100%', borderColor: '#dd1062', borderRadius: '10px' }}
                    >
                      <strong>Confirm and send request</strong>
                    </Button>
                  </ValidatedForm>
                )}
              </Col>
            </Row>

          </Grid>

          <Grid item xs={12} md={5}>
            <Container style={{ position: 'sticky', top: '150px', boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '10px' }}>
              <div className="booking-info" >
                <div className="room-detail-content">
                  <Row style={{ paddingBottom: '20px' }}>
                    <Col md="4" style={{ paddingLeft: '15px' }}>
                      <CardMedia className='img-room' image={parallaxImages[0]} />
                    </Col>

                    <Col md="6">
                      <div className="booking-info">
                        <Typography variant="subtitle1"><strong>{roomEntity.roomName}</strong></Typography>
                        <Typography variant="subtitle2">{roomEntity.address}</Typography>
                        <div style={{ display: 'flex', alignItems: 'left' }}>
                          <StarIcon style={{ height: '20px', color: 'gold' }} />
                          <Typography variant="subtitle2" style={{ marginLeft: '2px' }}><strong>{roomEntity.rating || 0}</strong></Typography>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>


                <Divider style={{ marginBottom: '20px', backgroundColor: '#000', opacity: 0.18 }} />


                <Row>
                  <h4>Price details</h4>

                  <Row>
                    {/* <Typography variant="subtitle2" align='center'>You won't be charged yet</Typography> */}


                    <Col md="6" style={{ marginTop: '15px' }}>
                      {numberOfHours > 0 && (
                        <div className="room-detail-header">
                          <Typography variant="subtitle2">{"VNĐ " + roomEntity.price + " x " + numberOfHours + " giờ"}</Typography>
                        </div>
                      )}

                      {serviceFee > 0 && (<div className="room-detail-header">
                        <Typography variant="subtitle2">Service fee</Typography>
                      </div>)}
                    </Col>


                    <Col md="4" style={{ marginLeft: 'auto', marginTop: '15px' }}>
                      {numberOfHours > 0 && (
                        <div className="room-detail-header">
                          <Typography style={{ textAlign: 'end' }} variant="subtitle2">{"VNĐ " + roomEntity.price * numberOfHours}</Typography>
                        </div>
                      )}
                      {serviceFee > 0 && (
                        <div className="room-detail-header">
                          <Typography style={{ textAlign: 'end' }} variant="subtitle2">{"VNĐ " + serviceFee}</Typography>
                        </div>
                      )}
                    </Col>
                  </Row>

                  {/* <Divider style={{ marginBottom: '20px', marginTop: '20px', backgroundColor: '#000', opacity: 0.18 }} /> */}

                  {/* <Col md="6">
                    <div className="room-detail-header">
                      <Typography variant="subtitle2">{"VNĐ " + roomEntity.price + " x 2 hour"}</Typography>
                    </div>
                    <div className="room-detail-header">
                      <Typography variant="subtitle2">Service fee</Typography>
                    </div>
                  </Col>

                  <Col md="4" style={{ marginLeft: 'auto' }}>
                    <div className="room-detail-header">
                      <Typography style={{ textAlign: 'end' }} variant="subtitle2">{"VNĐ " + roomEntity.price * 2}</Typography>
                    </div>
                    <div className="room-detail-header">
                      <Typography style={{ textAlign: 'end' }} variant="subtitle2">{"VNĐ " + 100.000}</Typography>
                    </div>
                  </Col> */}
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
                      <Typography style={{ textAlign: 'end' }} variant="subtitle2"><strong>{"VNĐ " + "VNĐ " + (roomEntity.price * numberOfHours + serviceFee)}</strong></Typography>
                    </div>
                  </Col>
                </Row>

              </div>
            </Container>
          </Grid>

        </Grid>

      </StyledRoomDetail>

    </div>
  );
};

export default RoomBookingForCustomer