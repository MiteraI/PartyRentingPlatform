import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './booking.reducer';

export const BookingDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const bookingEntity = useAppSelector(state => state.booking.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bookingDetailsHeading">Booking Trị An</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{bookingEntity.id}</dd>
          <dt>
            <span id="customerName">Customer Name</span>
          </dt>
          <dd>{bookingEntity.customerName}</dd>
          <dt>
            <span id="bookTime">Book Time</span>
          </dt>
          <dd>{bookingEntity.bookTime ? <TextFormat value={bookingEntity.bookTime} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="startTime">Start Time</span>
          </dt>
          <dd>{bookingEntity.startTime ? <TextFormat value={bookingEntity.startTime} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="endTime">End Time</span>
          </dt>
          <dd>{bookingEntity.endTime ? <TextFormat value={bookingEntity.endTime} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="totalPrice">Total Price</span>
          </dt>
          <dd>{bookingEntity.totalPrice}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{bookingEntity.status}</dd>
          <dt>
            <span id="rating">Rating</span>
          </dt>
          <dd>{bookingEntity.rating}</dd>
          <dt>
            <span id="comment">Comment</span>
          </dt>
          <dd>{bookingEntity.comment}</dd>
          <dt>Room</dt>
          <dd>{bookingEntity.room ? bookingEntity.room.id : ''}</dd>
          <dt>User</dt>
          <dd>{bookingEntity.user ? bookingEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/booking" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/booking/${bookingEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default BookingDetail;
