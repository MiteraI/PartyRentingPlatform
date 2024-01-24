import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './promotion.reducer';

export const PromotionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const promotionEntity = useAppSelector(state => state.promotion.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="promotionDetailsHeading">Promotion</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{promotionEntity.id}</dd>
          <dt>
            <span id="startTime">Start Time</span>
          </dt>
          <dd>
            {promotionEntity.startTime ? <TextFormat value={promotionEntity.startTime} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endTime">End Time</span>
          </dt>
          <dd>{promotionEntity.endTime ? <TextFormat value={promotionEntity.endTime} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="discount">Discount</span>
          </dt>
          <dd>{promotionEntity.discount}</dd>
          <dt>
            <span id="minimum">Minimum</span>
          </dt>
          <dd>{promotionEntity.minimum}</dd>
        </dl>
        <Button tag={Link} to="/promotion" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/promotion/${promotionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default PromotionDetail;
