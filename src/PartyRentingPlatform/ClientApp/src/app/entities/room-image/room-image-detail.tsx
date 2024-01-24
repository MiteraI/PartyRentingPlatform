import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './room-image.reducer';

export const RoomImageDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const roomImageEntity = useAppSelector(state => state.roomImage.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="roomImageDetailsHeading">Room Image</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{roomImageEntity.id}</dd>
          <dt>
            <span id="imageUrl">Image Url</span>
          </dt>
          <dd>{roomImageEntity.imageUrl}</dd>
          <dt>Room</dt>
          <dd>{roomImageEntity.room ? roomImageEntity.room.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/room-image" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/room-image/${roomImageEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default RoomImageDetail;
