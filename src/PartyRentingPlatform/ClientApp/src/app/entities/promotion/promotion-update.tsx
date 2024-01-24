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
import { IPromotion } from 'app/shared/model/promotion.model';
import { getEntity, updateEntity, createEntity, reset } from './promotion.reducer';

export const PromotionUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const rooms = useAppSelector(state => state.room.entities);
  const promotionEntity = useAppSelector(state => state.promotion.entity);
  const loading = useAppSelector(state => state.promotion.loading);
  const updating = useAppSelector(state => state.promotion.updating);
  const updateSuccess = useAppSelector(state => state.promotion.updateSuccess);

  const handleClose = () => {
    navigate('/promotion' + location.search);
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
    values.startTime = convertDateTimeToServer(values.startTime);
    values.endTime = convertDateTimeToServer(values.endTime);
    if (values.discount !== undefined && typeof values.discount !== 'number') {
      values.discount = Number(values.discount);
    }
    if (values.minimum !== undefined && typeof values.minimum !== 'number') {
      values.minimum = Number(values.minimum);
    }

    const entity = {
      ...promotionEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          startTime: displayDefaultDateTime(),
          endTime: displayDefaultDateTime(),
        }
      : {
          ...promotionEntity,
          startTime: convertDateTimeFromServer(promotionEntity.startTime),
          endTime: convertDateTimeFromServer(promotionEntity.endTime),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="partyRentingPlatformApp.promotion.home.createOrEditLabel" data-cy="PromotionCreateUpdateHeading">
            Create or edit a Promotion
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="promotion-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField
                label="Start Time"
                id="promotion-startTime"
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
                id="promotion-endTime"
                name="endTime"
                data-cy="endTime"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                }}
              />
              <ValidatedField
                label="Discount"
                id="promotion-discount"
                name="discount"
                data-cy="discount"
                type="text"
                validate={{
                  required: { value: true, message: 'This field is required.' },
                  min: { value: 0, message: 'This field should be at least 0.' },
                  validate: v => isNumber(v) || 'This field should be a number.',
                }}
              />
              <ValidatedField label="Minimum" id="promotion-minimum" name="minimum" data-cy="minimum" type="text" />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/promotion" replace color="info">
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

export default PromotionUpdate;
