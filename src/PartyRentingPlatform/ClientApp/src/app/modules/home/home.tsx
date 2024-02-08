import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Alert, Carousel, CarouselItem, CarouselControl, CarouselIndicators } from 'reactstrap';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { Grid, Paper, Typography, CardContent, CardActions, Button, CardMedia } from '@mui/material';
import Slider from 'react-slick';
import { getEntities, deleteEntity } from 'app/entities/room/room.reducer';
import RoomIcon from '@mui/icons-material/Room';

//Rating 
import { Star, StarBorder } from '@mui/icons-material';

// Import slick-carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Home.scss';

const Home = () => {
  const dispatch = useAppDispatch();
  const roomList = useAppSelector((state) => state.room.entities);
  const loading = useAppSelector((state) => state.room.loading);
  const account = useAppSelector((state) => state.authentication.account);

  const [currentPage, setCurrentPage] = useState(0);


  // Bổ sung một số hàm trợ giúp để tạo ra biểu tượng ngôi sao
  const generateStarIcons = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? <Star key={i} className="star-icon" /> : <StarBorder key={i} className="star-icon" />);
    }
    return stars;
  };

  // Fetch room entities on component mount
  useEffect(() => {
    dispatch(getEntities({ page: currentPage, size: 4, sort: 'id,asc' }));
  }, [dispatch]);

  // Define your carousel items
  const carouselItems = [
    {
      src: 'https://www.parents.com/thmb/--pZafKsgGSb8NrJVrV7lqJId9g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/BirthdayParty-GettyImages-1600792233-c2a961509556414f9f41b92b8471a551.jpg',
      altText: 'Party Room 1',
      caption: 'Không gian tuyệt vời!',
    },
    {
      src: 'https://berkscountyliving.com/downloads/18196/download/iStock-918933880.jpg?cb=1155e4a7652ab617e102986ad35ab972',
      altText: 'Party Room 2',
      caption: 'Dịch vụ hấp dẫn!',
    },
    {
      src: 'https://st3.depositphotos.com/1002111/14176/i/1600/depositphotos_141766842-stock-photo-happy-kids-birthday.jpg',
      altText: 'Party Room 3',
      caption: 'Phục vụ chu đáo!',
    },
    // Add more carousel items as needed
  ];

  // Carousel state variables
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Carousel handlers
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === carouselItems.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? carouselItems.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  // Slick Carousel settings
  const slickSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    // customPaging: function (i) {
    //   return (
    //     <a>
    //       <img src={carouselItems[i].src} alt={carouselItems[i].altText} className="thumbnail" />
    //     </a>
    //   );
    // },
  };



  const handleDelete = (id) => {
    dispatch(deleteEntity(id));
  };



  return (

    <div className="home-page">
      <Row>
        <Col md="6">
          <h1 className="display-4">Khám phá các bữa tiệc nào!!!</h1>
          <p className="lead">Hãy tìm điểm dừng chân tiếp theo cho bữa tiệc hoành tráng của bạn.</p>
          {account?.login ? (
            <Alert color="success">Welcome back, {account.login}!</Alert>
          ) : (
            <div>
              <Alert color="warning">
                Bạn đang phân vân nơi tổ chức?{' '}
                <Link to="/account/register" className="alert-link">
                  Đăng ký ngay
                </Link>{' '}
                và bắt đầu chuyến phiêu lưu nào!
              </Alert>
            </div>
          )}
        </Col>
        <Col md="6">
          {/* Carousel component */}
          <Carousel activeIndex={activeIndex} next={next} previous={previous}>
            <CarouselIndicators
              items={carouselItems}
              activeIndex={activeIndex}
              onClickHandler={(index) => setActiveIndex(index)}
            />
            {carouselItems.map((item, index) => (
              <CarouselItem key={index}>
                <img src={item.src} alt={item.altText} className="img-fluid rounded" />
                <div className="carousel-caption d-none d-md-block">
                  <h3>{item.caption}</h3>
                </div>
              </CarouselItem>
            ))}
            <CarouselControl direction="prev" directionText="Previous" onClickHandler={previous} />
            <CarouselControl direction="next" directionText="Next" onClickHandler={next} />
          </Carousel>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md="12">
          <p className="mb-4">Bạn muốn buổi tiệc được tổ chức ở:</p>
          <ul className="destination-list">
            <li>
              <Link to="/destinations/paris">Hà Nội</Link>
            </li>
            <li>
              <Link to="/destinations/new-york">TP Hồ Chí Minh</Link>
            </li>
            <li>
              <Link to="/destinations/tokyo">Đà Nẵng</Link>
            </li>
            {/* Add more destinations as needed */}
          </ul>
        </Col>
      </Row>
      <div className="table-responsive">
        {roomList && roomList.length > 0 ? (
          <Grid container spacing={3} mb={4}>
            {roomList.map((item) => (
              <Grid item key={item.id} xs={12} sm={6} md={3}>
                <Paper className="apartment-card" component={Link} to={`/room/${item.id}`} style={{ textDecoration: 'none' }} elevation={3}>
                  {/* Slick Carousel for images */}
                  <div>
                    <Slider {...slickSettings}>
                      {carouselItems.map((carouselItem, index) => (
                        <CardMedia className='img-room' key={index} image={carouselItem.src}>
                          {/* <img src={carouselItem.src} alt={carouselItem.altText} /> */}

                        </CardMedia>
                      ))}
                    </Slider>
                  </div>

                  {/* Apartment details */}
                  <div>
                    <Typography variant="h6" component="div" className='room-name'>
                      <strong>{item.roomName}</strong>
                    </Typography>
                    <div className="rating">
                      {generateStarIcons(item.rating)}
                    </div>
                    <Typography variant="body2" color="text.secondary" className="description">
                      {item.description}
                    </Typography>
                    <div className="address">
                      <RoomIcon sx={{ color: 'pink', verticalAlign: 'middle', marginRight: '4px' }} /> {/* Icon for address */}
                      <Typography variant="body2" color="text.secondary" style={{ display: 'inline-block' }}>
                        {item.address}
                      </Typography>
                    </div>
                    {/* Giá tiền */}
                    <Typography style={{ marginTop: '2px' }} variant="body2" color="text.primary">
                      <strong>{item.price} VND</strong> / đêm
                    </Typography>
                  </div>
                  {/* Card actions */}
                  {/* <CardActions>
                    <Button color="primary" component={Link} to={`/room/${item.id}`}>
                      View Details
                    </Button>
                    <Button color="primary" component={Link} to={`/room/${item.id}/edit`}>
                      Edit
                    </Button>
                    <Button color="primary" onClick={() => handleDelete(item.id)}>
                      Delete
                    </Button>
                  </CardActions> */}
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          !loading && <div className="alert alert-warning">No Rooms found</div>
        )}
      </div>
    </div>
  );
};

export default Home;
