import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import {} from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './room.reducer';

export const RoomDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const roomEntity = useAppSelector(state => state.room.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="roomDetailsHeading">Room</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{roomEntity.id}</dd>
          <dt>
            <span id="roomName">Room Name</span>
          </dt>
          <dd>{roomEntity.roomName}</dd>
          <dt>
            <span id="address">Address</span>
          </dt>
          <dd>{roomEntity.address}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{roomEntity.description}</dd>
          <dt>
            <span id="price">Price</span>
          </dt>
          <dd>{roomEntity.price}</dd>
          <dt>
            <span id="roomCapacity">Room Capacity</span>
          </dt>
          <dd>{roomEntity.roomCapacity}</dd>
          <dt>
            <span id="rating">Rating</span>
          </dt>
          <dd>{roomEntity.rating}</dd>
          <dt>
            <span id="status">Status</span>
          </dt>
          <dd>{roomEntity.status}</dd>
          <dt>User</dt>
          <dd>{roomEntity.user ? roomEntity.user.id : ''}</dd>
          <dt>Promotions</dt>
          <dd>
            {roomEntity.promotions
              ? roomEntity.promotions.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {roomEntity.promotions && i === roomEntity.promotions.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>Services</dt>
          <dd>
            {roomEntity.services
              ? roomEntity.services.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {roomEntity.services && i === roomEntity.services.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/room" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/room/${roomEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default RoomDetail;
