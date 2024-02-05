// Import necessary React components and styles
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Alert, Carousel, CarouselItem, CarouselControl, CarouselIndicators } from 'reactstrap';
import { useAppSelector } from 'app/config/store';
import { Grid, Paper, Typography, CardContent, CardMedia, CardActions, Card, Button } from '@mui/material';
import Slider from 'react-slick';

// Import slick-carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

 // Define your carousel items
 const carouselItems = [
  // ... (unchanged)
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
};

// Import your custom styling for the home page
import './Home.scss';


const Home = () => {
  const account = useAppSelector((state) => state.authentication.account);

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
            <CarouselIndicators items={carouselItems} activeIndex={activeIndex} onClickHandler={(index) => setActiveIndex(index)} />
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

        {/* Material-UI Grid for apartment cards */}
      <Grid container spacing={2}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <Grid item key={item} xs={12} sm={6} md={3}>
            <Paper className="apartment-card" elevation={3}>
              {/* Slick Carousel for images */}
              <Slider {...slickSettings}>
                {carouselItems.map((item, index) => (
                  <div key={index}>
                    <img src={item.src} alt={item.altText} className="img-fluid rounded" />
                  </div>
                ))}
              </Slider>

              {/* Apartment details */}
              <CardContent>
                <Typography variant="h6" component="div">
                  Apartment {item}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Details about the apartment
                </Typography>
              </CardContent>

              {/* Card actions */}
              <CardActions>
                <Button color="primary">Book Now</Button>
              </CardActions>
            </Paper>
          </Grid>
        ))}
      </Grid>

      </Row>
    </div>
  );
};

export default Home;
