import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IService } from 'app/shared/model/service.model';
import { getEntities as getServices } from 'app/entities/service/service.reducer';
import { IBooking } from 'app/shared/model/booking.model';
import { getEntities as getBookings } from 'app/entities/booking/booking.reducer';
import { IBookingDetails } from 'app/shared/model/booking-details.model';
import { getEntity, updateEntity, createEntity, reset } from './booking-details.reducer';

export const BookingDetailsUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const services = useAppSelector(state => state.service.entities);
  const bookings = useAppSelector(state => state.booking.entities);
  const bookingDetailsEntity = useAppSelector(state => state.bookingDetails.entity);
  const loading = useAppSelector(state => state.bookingDetails.loading);
  const updating = useAppSelector(state => state.bookingDetails.updating);
  const updateSuccess = useAppSelector(state => state.bookingDetails.updateSuccess);

  const handleClose = () => {
    navigate('/booking-details');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getServices({}));
    dispatch(getBookings({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  // eslint-disable-next-line complexity
  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.serviceQuantity !== undefined && typeof values.serviceQuantity !== 'number') {
      values.serviceQuantity = Number(values.serviceQuantity);
    }

    const entity = {
      ...bookingDetailsEntity,
      ...values,
      service: services.find(it => it.id.toString() === values.service.toString()),
      booking: bookings.find(it => it.id.toString() === values.booking.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...bookingDetailsEntity,
          service: bookingDetailsEntity?.service?.id,
          booking: bookingDetailsEntity?.booking?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="partyRentingPlatformApp.bookingDetails.home.createOrEditLabel" data-cy="BookingDetailsCreateUpdateHeading">
            Create or edit a Booking Details
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField name="id" required readOnly id="booking-details-id" label="ID" validate={{ required: true }} />
              ) : null}
              <ValidatedField
                label="Service Quantity"
                id="booking-details-serviceQuantity"
                name="serviceQuantity"
                data-cy="serviceQuantity"
                type="text"
                validate={{
                  min: { value: 0, message: 'This field should be at least 0.' },
                  validate: v => isNumber(v) || 'This field should be a number.',
                }}
              />
              <ValidatedField id="booking-details-service" name="service" data-cy="service" label="Service" type="select" required>
                <option value="" key="0" />
                {services
                  ? services.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <FormText>This field is required.</FormText>
              <ValidatedField id="booking-details-booking" name="booking" data-cy="booking" label="Booking" type="select">
                <option value="" key="0" />
                {bookings
                  ? bookings.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/booking-details" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default BookingDetailsUpdate;
