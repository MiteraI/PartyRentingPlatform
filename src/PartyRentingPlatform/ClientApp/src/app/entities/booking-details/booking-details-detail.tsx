import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './booking-details.reducer';

export const BookingDetailsDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const bookingDetailsEntity = useAppSelector(state => state.bookingDetails.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bookingDetailsDetailsHeading">Booking Details</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{bookingDetailsEntity.id}</dd>
          <dt>
            <span id="serviceQuantity">Service Quantity</span>
          </dt>
          <dd>{bookingDetailsEntity.serviceQuantity}</dd>
          <dt>Service</dt>
          <dd>{bookingDetailsEntity.service ? bookingDetailsEntity.service.id : ''}</dd>
          <dt>Booking</dt>
          <dd>{bookingDetailsEntity.booking ? bookingDetailsEntity.booking.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/booking-details" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/booking-details/${bookingDetailsEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default BookingDetailsDetail;
