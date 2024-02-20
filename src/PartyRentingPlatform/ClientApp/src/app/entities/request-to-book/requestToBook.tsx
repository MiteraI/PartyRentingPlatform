import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getRooms } from 'app/entities/room/room.reducer';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IBooking } from 'app/shared/model/booking.model';
import { BookingStatus } from 'app/shared/model/enumerations/booking-status.model';
import { getEntity, updateEntity, createEntity, reset } from '../booking/booking.reducer';
import { Avatar, Divider, Grid, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { AxiosResponse } from 'axios';

const RequestToBook = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();
  const [createdBookingId, setCreatedBookingId] = useState<number | null>(null); // State to hold the created booking ID

  const StyledRoomDetail = styled('div')(({ theme }) => ({
    padding: '45px', // Default padding for larger screens
    [theme.breakpoints.down('sm')]: {
      padding: '15px', // Adjust padding for smaller screens
    },
  }));

  const navigate = useNavigate();

  useEffect(() => {
    // Check if createdBookingId is available and redirect
    if (createdBookingId !== null) {
      navigate(`/booking-tracking/${createdBookingId}`);
    }
  }, [createdBookingId, navigate]);

  const roomEntity = useAppSelector(state => state.room.entity);

  const isNew = true;

  const rooms = useAppSelector(state => state.room.entities);
  const users = useAppSelector(state => state.userManagement.users);
  const bookingEntity = useAppSelector(state => state.booking.entity);
  const loading = useAppSelector(state => state.booking.loading);
  const updating = useAppSelector(state => state.booking.updating);
  const updateSuccess = useAppSelector(state => state.booking.updateSuccess);
  const bookingStatusValues = Object.keys(BookingStatus);
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
      dispatch(getEntity(id));
    }

    dispatch(getRooms({}));
    dispatch(getUsers({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      // handleClose();
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
        room: rooms.find(it => it.id.toString() === id),
        user: users.find(it => it.id.toString() === account.id),
      };



      // Dispatch the createEntity action
      const createEntityAction = await dispatch(createEntity(entity));
      // type CreateEntityAction = PayloadAction<AxiosResponse<IBooking>, string, { arg: string | number; requestId: string; requestStatus: "fulfilled" }, never>;
      const newBookingId = (createEntityAction.payload as AxiosResponse<IBooking>)?.data?.id || null;
      console.log(newBookingId);
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
        startTime: displayDefaultDateTime(),
        endTime: displayDefaultDateTime(),
        status: 'APPROVING',
        price: roomEntity.price,
      }
      : {
        status: 'APPROVING',
        ...bookingEntity,
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
          <Grid item md={6}>
            <div className="room-detail-header">
              <h3>Confirm and pay</h3>
            </div>
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


            <Divider style={{ marginBottom: '24px' }}></Divider>


            <Row mt={1}>
              <p>{roomEntity.description}</p>
            </Row>

            <Row className="justify-content-center">
              <Col md="8">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
                    {!isNew ? <ValidatedField name="id" required readOnly id="booking-id" label="ID" validate={{ required: true }} /> : null}
                    <ValidatedField label="Customer Name" id="booking-customerName" name="customerName" data-cy="customerName" type="text" />
                    <ValidatedField
                      label="Book Time"
                      id="booking-bookTime"
                      name="bookTime"
                      data-cy="bookTime"
                      type="datetime-local"
                      placeholder="YYYY-MM-DD HH:mm"
                      validate={{
                        required: { value: true, message: 'This field is required.' },
                      }}
                    />
                    <ValidatedField
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
                    />
                    <ValidatedField
                      label="Total Price"
                      id="booking-totalPrice"
                      name="totalPrice"
                      value={roomEntity.price}
                      data-cy="totalPrice"
                      type="text"
                      validate={{
                        required: { value: true, message: 'This field is required.' },
                        min: { value: 0, message: 'This field should be at least 0.' },
                        validate: v => isNumber(v) || 'This field should be a number.',
                      }}
                    />

                    <FormText>This field is required.</FormText>

                    &nbsp;
                    <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                      <FontAwesomeIcon icon="save" />
                      &nbsp; Save
                    </Button>
                  </ValidatedForm>
                )}
              </Col>
            </Row>

          </Grid>

          <Grid item xs={12} md={5}>
            <div className="booking-info" style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '10px' }}>

              <div className="room-detail-content">
                <Row>
                  <Col md="6" style={{ height: '100%', overflow: 'hidden', padding: '0', paddingRight: '5px' }}>
                    <img src={parallaxImages[0]} alt={`Room Image 2`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover', paddingBottom: '10px' }} />
                  </Col>

                  <Col md="4">
                    <div className="booking-info">
                      <Typography mb={2} variant="h6"><strong>{roomEntity.roomName}</strong></Typography>
                      <Typography variant="subtitle2">{roomEntity.address}</Typography>
                      <Typography variant="subtitle2">{roomEntity.price}</Typography>
                    </div>
                  </Col>
                </Row>
              </div>


              <Divider />

              <Row>
                <Col md="8">
                  <div className="room-detail-header">
                    <h4>Price details</h4>
                    <Typography variant="subtitle1">{roomEntity.address}</Typography>
                  </div>

                  <div className="room-detail-content">
                    <Row>
                      <Col md="8">
                        <Typography variant="h6">Booking Information</Typography>
                        {/* <p>{roomEntity.description}</p> */}

                        <div className="host-info">
                          <Avatar src="path/to/host-avatar.jpg" alt="Host Avatar" />
                          <Typography variant="subtitle2">{roomEntity.user?.login}</Typography>
                        </div>
                      </Col>

                      <Col md="4">
                        <div className="booking-info">
                          <Typography variant="h6">Booking Info</Typography>
                          <Divider />
                        </div>
                      </Col>
                    </Row>
                  </div>

                  <Button tag={Link} to={`/room/${id}`} replace color="info">
                    <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back to Room Details</span>
                  </Button>
                </Col>
              </Row>

            </div>
          </Grid>
        </Grid>

      </StyledRoomDetail>

    </div>
  );
};

export default RequestToBook;
