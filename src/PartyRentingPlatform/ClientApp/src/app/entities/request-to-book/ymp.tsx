import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { Typography, Avatar, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity as getRoomEntity } from 'app/entities/room/room.reducer';
import { ValidatedField, ValidatedForm } from 'react-jhipster';
import { convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { createEntity as createBookingEntity } from '../booking/booking.reducer';

const RequestToBook = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getRoomEntity(id));
  }, [dispatch, id]);

  const roomEntity = useAppSelector(state => state.room.entity);

  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleRequestToBook = () => {
    setShowBookingForm(true);
  };

  const handleCancelBooking = () => {
    setShowBookingForm(false);
  };

  const defaultValues = {
    bookTime: displayDefaultDateTime(),
    startTime: displayDefaultDateTime(),
    endTime: displayDefaultDateTime(),
    status: 'ACCEPTED',
  };

  const saveEntity = (values) => {
    const entity = {
      ...values,
      customerName: values.customerName,
      room: roomEntity,
    };

    // Convert date and time fields to the server format
    entity.bookTime = convertDateTimeToServer(values.bookTime);
    entity.startTime = convertDateTimeToServer(values.startTime);
    entity.endTime = convertDateTimeToServer(values.endTime);

    // Dispatch the createBookingEntity action
    dispatch(createBookingEntity(entity))
      .then(() => {
        // Handle success, reset state, or show a success message
        setShowBookingForm(false);
      })
      .catch((error) => {
        console.error('Error creating booking:', error);
        // Handle the error, display a user-friendly message, or log more details
      });
  };

  const updating = useAppSelector(state => state.booking.updating);

  return (
    <div>
      <Row>
        <Col md="8">
          <div className="room-detail-header">
            <h1>{roomEntity.roomName}</h1>
            <Typography variant="subtitle1">{roomEntity.address}</Typography>
          </div>

          <div className="room-detail-content">
            <Row>
              <Col md="8">
                <Typography variant="h6">Booking Information</Typography>
                <p>{roomEntity.description}</p>

                <div className="host-info">
                  <Avatar src="path/to/host-avatar.jpg" alt="Host Avatar" />
                  <Typography variant="subtitle2">{roomEntity.user?.login}</Typography>
                </div>
              </Col>

              <Col md="4">
                <div className="booking-info">
                  <Typography variant="h6">Booking Info</Typography>
                  <Divider />
                  <Typography variant="subtitle2">Availability Calendar</Typography>
                  {/* Add your calendar component here */}
                  <Typography variant="subtitle2">Price: ${roomEntity.price} / night</Typography>
                  {showBookingForm ? (
                    <ValidatedForm defaultValues={defaultValues} onSubmit={saveEntity}>
                      {/* ... Your ValidatedField components ... */}
                      <FormText>This field is required.</FormText>
                      <Button color="primary" type="submit" disabled={updating}>
                        <FontAwesomeIcon icon="save" />
                        &nbsp; Save
                      </Button>
                    </ValidatedForm>
                  ) : (
                    <Button color="primary" size="large" onClick={handleRequestToBook}>
                      Request to Book
                    </Button>
                  )}
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
  );
};

export default RequestToBook;
