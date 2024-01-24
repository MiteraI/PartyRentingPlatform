import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IRoom } from 'app/shared/model/room.model';
import { getEntities as getRooms } from 'app/entities/room/room.reducer';
import { IRoomImage } from 'app/shared/model/room-image.model';
import { getEntity, updateEntity, createEntity, reset } from './room-image.reducer';

export const RoomImageUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const rooms = useAppSelector(state => state.room.entities);
  const roomImageEntity = useAppSelector(state => state.roomImage.entity);
  const loading = useAppSelector(state => state.roomImage.loading);
  const updating = useAppSelector(state => state.roomImage.updating);
  const updateSuccess = useAppSelector(state => state.roomImage.updateSuccess);

  const handleClose = () => {
    navigate('/room-image');
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getRooms({}));
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

    const entity = {
      ...roomImageEntity,
      ...values,
      room: rooms.find(it => it.id.toString() === values.room.toString()),
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
          ...roomImageEntity,
          room: roomImageEntity?.room?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="partyRentingPlatformApp.roomImage.home.createOrEditLabel" data-cy="RoomImageCreateUpdateHeading">
            Create or edit a Room Image
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="room-image-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Image Url" id="room-image-imageUrl" name="imageUrl" data-cy="imageUrl" type="text" />
              <ValidatedField id="room-image-room" name="room" data-cy="room" label="Room" type="select">
                <option value="" key="0" />
                {rooms
                  ? rooms.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/room-image" replace color="info">
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

export default RoomImageUpdate;
