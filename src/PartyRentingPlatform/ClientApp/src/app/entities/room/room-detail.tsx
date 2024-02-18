// RoomDetail.tsx
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Divider, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';

import { Parallax } from 'react-parallax';
import { useNavigate } from 'react-router-dom';
import { faShareAlt, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './room.reducer';

const StyledRoomDetail = styled('div')(({ theme }) => ({
  padding: '30px', // Default padding for larger screens
  [theme.breakpoints.down('sm')]: {
    padding: '15px', // Adjust padding for smaller screens
  },
}));

export const RoomDetail = () => {
  const dispatch = useAppDispatch();
  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, [dispatch, id]);

  const roomEntity = useAppSelector((state) => state.room.entity);

  const parallaxImages = [
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/57db1f13-4807-4198-b3a2-2ec5429512e6.jpeg?im_w=960',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/a32e94e7-a54a-4885-92f2-371694082845.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/46be33d4-9ad2-4b22-b9f3-d99bb5d0533d.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',
    'https://a0.muscache.com/im/pictures/miso/Hosting-667691518993177053/original/4e702f0e-fd3c-4754-bd2b-a8714dc35f48.jpeg?im_w=720',

  ];

  const navigate = useNavigate();

  const handleBookClick = () => {
    navigate(`/request-to-book/${roomEntity.id}`);
  };

  return (
    <StyledRoomDetail>
      <Grid container spacing={3} mb={2}>
        <Grid item md={6}>
          <div className="room-detail-header">
            <h3>{roomEntity.roomName}</h3>
          </div>
        </Grid>
        <Grid item md={6} container justifyContent="flex-end" alignItems="center">
          <Button
            color="primary"
            style={{
              marginRight: '10px',
              border: 'none',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              color: 'black',
            }}
          >
            <FontAwesomeIcon icon={faShareAlt} style={{ marginRight: '5px' }} /> Share
          </Button>
          <Button
            color="primary"
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              color: 'black',
            }}
          >
            <FontAwesomeIcon icon={faHeart} style={{ marginRight: '5px' }} /> Save
          </Button>
        </Grid>
      </Grid>



      {/* Custom layout for room images */}
      <div className="room-detail-header" style={{ height: '300px', overflow: 'hidden', borderRadius: '10px' }}>
        <Row style={{ height: '300px', overflow: 'hidden' }}>
          <Col md="6" style={{ height: '100%', overflow: 'hidden', paddingRight: '10px' }}>
            <img src={parallaxImages[0]} alt={`Room Image 0`} className="full-width" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Col>
          <Col md="6" style={{ height: '100%', overflow: 'hidden' }}>
            <Row style={{ height: '100%', overflow: 'hidden' }}>
              <Col md="6" style={{ height: '100%', overflow: 'hidden', padding: '0', paddingRight: '10px' }}>
                <img src={parallaxImages[1]} alt={`Room Image 1`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover', paddingBottom: '10px' }} />
                <img src={parallaxImages[3]} alt={`Room Image 3`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
              </Col>
              <Col md="6" style={{ height: '100%', overflow: 'hidden', padding: '0', paddingRight: '5px' }}>
                <img src={parallaxImages[2]} alt={`Room Image 2`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover', paddingBottom: '10px' }} />
                <img src={parallaxImages[4]} alt={`Room Image 4`} className="full-width" style={{ width: '100%', height: '50%', objectFit: 'cover' }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </div>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} md={8} pr={8}>
          <div className="room-detail-header">
            <h4>{roomEntity.roomName}</h4>
            <Typography mb={3} variant="subtitle1">{roomEntity.address}</Typography>
          </div>
          <Divider style={{ marginBottom: '20px', marginTop: '20px', backgroundColor: '#000', opacity: 0.1 }} />


          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} md={8}>
              <div className="host-info" style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src="https://th.bing.com/th/id/OIP.Rx2i9gGIkn78qbbIF_m3IgHaJ0?pid=ImgDet&w=208&h=276&c=7&dpr=2"
                  alt="Host Avatar"
                  style={{ width: '50px', height: '50px' }} // Adjust the width and height as needed
                />
                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Typography variant="subtitle1"><strong>{roomEntity.user?.login}</strong></Typography>
                  <Typography variant="body2">Superhost • 10 months hosting</Typography>
                </div>
              </div>
            </Grid>
          </Grid>

          <Divider style={{ marginBottom: '24px', backgroundColor: '#000', opacity: 0.1 }} />


          <Row mt={1}>
            <p>{roomEntity.description}</p>
          </Row>

        </Grid>

        <Grid item xs={12} md={4}>
          <div className="booking-info" style={{ boxShadow: 'rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px', padding: '24px', borderRadius: '10px' }}>
            <Typography mb={2} variant="h6"><strong>${roomEntity.price}</strong> night</Typography>
            <Divider />
            <Typography variant="subtitle2">Availability Calendar</Typography>
            <Button
              color="primary"
              size="large"
              data-cy="bookButton"
              onClick={handleBookClick}
              style={{ backgroundColor: '#dd1062', height: '48px', width: '100%', borderColor: '#dd1062', borderRadius: '10px' }}
            >
              <strong>Reserve</strong>
            </Button>

          </div>
        </Grid>
      </Grid>

      {/* <Divider>Bỏ khúc dưới ra</Divider>


      <Row>
        <Col md="8">
          <Button tag={Link} to="/room" replace color="info" data-cy="entityDetailsBackButton">
            <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/room/${roomEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
          </Button>
        </Col>
      </Row> */}
    </StyledRoomDetail>
  );
};

export default RoomDetail;
