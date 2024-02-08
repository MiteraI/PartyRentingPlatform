import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Divider, Typography } from '@mui/material';
import { Parallax } from 'react-parallax';
import { useNavigate } from 'react-router-dom'; // Thêm import useNavigate

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './room.reducer';

export const RoomDetail = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, [dispatch, id]);

  const roomEntity = useAppSelector(state => state.room.entity);

  const parallaxImages = [
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/57db1f13-4807-4198-b3a2-2ec5429512e6.jpeg?im_w=960',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/a32e94e7-a54a-4885-92f2-371694082845.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/46be33d4-9ad2-4b22-b9f3-d99bb5d0533d.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',
  ];

  const navigate = useNavigate();

  const handleBookClick = () => {
    // Chuyển hướng đến trang RequestToBook với id của phòng
    navigate(`/request-to-book/${roomEntity.id}`);
  };

  return (
    <div>
      <Parallax
        blur={{ min: -15, max: 15 }}
        bgImage={parallaxImages[0]}
        strength={500}
        renderLayer={(percentage) => (
          <div
            style={{
              position: 'absolute',
              background: `rgba(0, 0, 0, ${percentage * 0.5})`,
              width: '100%',
              height: '100%',
            }}
          />
        )}
      >
        <div className="room-detail-header">
          <h1>{roomEntity.roomName}</h1>
          <Typography variant="subtitle1">{roomEntity.address}</Typography>
        </div>
      </Parallax>

      <Row>
        <Col md="8">
          <div className="room-detail-header">
            <h1>{roomEntity.roomName}</h1>
            <Typography variant="subtitle1">{roomEntity.address}</Typography>
          </div>

          <div className="room-detail-content">
            <Row>
              <Col md="8">
                <Typography variant="h6">About this space</Typography>
                <p>{roomEntity.description}</p>

                <div className="host-info">
                  <Avatar src="path/to/host-avatar.jpg" alt="Host Avatar" />
                  <Typography variant="subtitle2">{roomEntity.user?.login}</Typography>
                </div>
              </Col>

              <Col md="4">
                <div className="booking-info">
                  <Typography variant="h6">Booking Info</Typography>
                  <Divider />
                  <Typography variant="subtitle2">Availability Calendar</Typography>
                  {/* Add your calendar component here */}
                  <Typography variant="subtitle2">Price: ${roomEntity.price} / night</Typography>
                  <Button color="primary" size="large" data-cy="bookButton" onClick={handleBookClick}>
                    Book
                  </Button>
                </div>
              </Col>
            </Row>
          </div>

          <Button tag={Link} to="/room" replace color="info" data-cy="entityDetailsBackButton">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/room/${roomEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default RoomDetail;
