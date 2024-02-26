import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IUser } from 'app/shared/model/user.model';
import { getUsers } from 'app/modules/administration/user-management/user-management.reducer';
import { IPromotion } from 'app/shared/model/promotion.model';
import { getEntities as getPromotions } from 'app/entities/promotion/promotion.reducer';
import { IService } from 'app/shared/model/service.model';
import { getEntities as getServices } from 'app/entities/service/service.reducer';
import { IRoom } from 'app/shared/model/room.model';
import { RoomStatus } from 'app/shared/model/enumerations/room-status.model';
import { getEntity, updateEntity, createEntity, reset } from './room.reducer';

export const RoomUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const users = useAppSelector(state => state.userManagement.users);
  const promotions = useAppSelector(state => state.promotion.entities);
  const services = useAppSelector(state => state.service.entities);
  const roomEntity = useAppSelector(state => state.room.entity);
  const loading = useAppSelector(state => state.room.loading);
  const updating = useAppSelector(state => state.room.updating);
  const updateSuccess = useAppSelector(state => state.room.updateSuccess);
  const roomStatusValues = Object.keys(RoomStatus);

  const handleClose = () => {
    navigate('/room' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUsers({}));
    dispatch(getPromotions({}));
    dispatch(getServices({}));
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
    if (values.price !== undefined && typeof values.price !== 'number') {
      values.price = Number(values.price);
    }
    if (values.roomCapacity !== undefined && typeof values.roomCapacity !== 'number') {
      values.roomCapacity = Number(values.roomCapacity);
    }
    if (values.rating !== undefined && typeof values.rating !== 'number') {
      values.rating = Number(values.rating);
    }

    const entity = {
      ...roomEntity,
      ...values,
      promotions: mapIdList(values.promotions),
      services: mapIdList(values.services),
      user: users.find(it => it.id.toString() === values.user.toString()),
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
        status: 'BLOCKED',
        ...roomEntity,
        user: roomEntity?.user?.id,
        promotions: roomEntity?.promotions?.map(e => e.id.toString()),
        services: roomEntity?.services?.map(e => e.id.toString()),
      };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="partyRentingPlatformApp.room.home.createOrEditLabel" data-cy="RoomCreateUpdateHeading">
            Create or edit a Room
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="room-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Room Name"
                id="room-roomName"
                name="roomName"
                data-cy="roomName"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Address"
                id="room-address"
                name="address"
                data-cy="address"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField label="Description" id="room-description" name="description" data-cy="description" type="text" />
              <ValidatedField
                label="Price"
                id="room-price"
                name="price"
                data-cy="price"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                  min: { value: 0, message: 'This field should be at least 0.' },
                  validate: v => isNumber(v) || 'This field should be a number.',
                }}
              />
              <ValidatedField
                label="Room Capacity"
                id="room-roomCapacity"
                name="roomCapacity"
                data-cy="roomCapacity"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                  min: { value: 5, message: 'This field should be at least 5.' },
                  validate: v => isNumber(v) || 'This field should be a number.',
                }}
              />
              <ValidatedField
                label="Rating"
                id="room-rating"
                name="rating"
                data-cy="rating"
                type="text"
                validate={{
                  min: { value: 0, message: 'This field should be at least 0.' },
                  max: { value: 5, message: 'This field cannot be more than 5.' },
                  validate: v => isNumber(v) || 'This field should be a number.',
                }}
              />
              <ValidatedField label="Status" id="room-status" name="status" data-cy="status" type="select">
                {roomStatusValues.map(roomStatus => (
                  <option value={roomStatus} key={roomStatus}>
                    {roomStatus}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField id="room-user" name="user" data-cy="user" label="User" type="select" required>
                <option value="" key="0" />
                {users
                  ? users.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.id}
                    </option>
                  ))
                  : null}
              </ValidatedField>
              <FormText>This field is required.</FormText>
              <ValidatedField label="Promotions" id="room-promotions" data-cy="promotions" type="select" multiple name="promotions">
                <option value="" key="0" />
                {promotions
                  ? promotions.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.id}
                    </option>
                  ))
                  : null}
              </ValidatedField>
              <ValidatedField label="Services" id="room-services" data-cy="services" type="select" multiple name="services">
                <option value="" key="0" />
                {services
                  ? services.map(otherEntity => (
                    <option value={otherEntity.id} key={otherEntity.id}>
                      {otherEntity.id}
                    </option>
                  ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/room" replace color="info">
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

export default RoomUpdate;
