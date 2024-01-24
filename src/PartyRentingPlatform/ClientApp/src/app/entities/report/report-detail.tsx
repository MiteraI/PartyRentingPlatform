import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './report.reducer';

export const ReportDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const reportEntity = useAppSelector(state => state.report.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="reportDetailsHeading">Report</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{reportEntity.id}</dd>
          <dt>
            <span id="title">Title</span>
          </dt>
          <dd>{reportEntity.title}</dd>
          <dt>
            <span id="description">Description</span>
          </dt>
          <dd>{reportEntity.description}</dd>
          <dt>
            <span id="sentTime">Sent Time</span>
          </dt>
          <dd>{reportEntity.sentTime ? <TextFormat value={reportEntity.sentTime} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>Room</dt>
          <dd>{reportEntity.room ? reportEntity.room.id : ''}</dd>
          <dt>User</dt>
          <dd>{reportEntity.user ? reportEntity.user.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/report" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/report/${reportEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default ReportDetail;
