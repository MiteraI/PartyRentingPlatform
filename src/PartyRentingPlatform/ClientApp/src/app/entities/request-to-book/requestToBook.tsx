import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Typography, Avatar, Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity as getRoomEntity } from 'app/entities/room/room.reducer';;

const RequestToBook = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getRoomEntity(id));
  }, [dispatch, id]);

  const roomEntity = useAppSelector(state => state.room.entity);

  const handleRequestToBook = () => {
    // Logic to handle the request to book
    // You can navigate to a confirmation page or handle the booking process here
  };

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
                  <Button color="primary" size="large" onClick={handleRequestToBook}>
                    Request to Book
                  </Button>
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
