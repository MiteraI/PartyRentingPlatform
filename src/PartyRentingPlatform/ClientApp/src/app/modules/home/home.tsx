import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Alert, Carousel, CarouselItem, CarouselControl, CarouselIndicators } from 'reactstrap';
import { useAppSelector, useAppDispatch } from 'app/config/store';
import { Grid, Paper, Typography, CardContent, CardActions, Button, CardMedia } from '@mui/material';
import Slider from 'react-slick';
import { getEntities, deleteEntity, getEntityOfCustomers } from 'app/entities/room/room.reducer';
import { getEntities as getServiceEntities } from 'app/entities/service/service.reducer';
import RoomIcon from '@mui/icons-material/Room';


//Rating 
import { Star, StarBorder } from '@mui/icons-material';

// Import slick-carousel styles
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


import './home.scss';
import { addDeposit } from 'app/entities/wallet/wallet.reducer';
import { toast } from 'react-toastify';
import { formatCurrency } from 'app/shared/util/currency-utils';

const Home = () => {
  const dispatch = useAppDispatch();
  const roomList = useAppSelector((state) => state.room.entities);
  const loading = useAppSelector((state) => state.room.loading);
  const account = useAppSelector((state) => state.authentication.account);
  const serviceList = useAppSelector(state => state.service.entities);
  const [currentPage, setCurrentPageloading] = useState(0);
  const userExisted = localStorage.getItem("user");



  const updateSuccess = useAppSelector(state => state.wallet.updateSuccess);

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
    dispatch(getEntityOfCustomers({ page: currentPage, size: 100, sort: 'id,asc' }));
  }, [dispatch]);


  // use to deposit money to host or customer


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = Number(urlParams.get('vnp_Amount')) / 100;
    const transactionNo = Number(urlParams.get("vnp_TransactionNo"));


    if (urlParams && amount != 0 && transactionNo != 0) {
      dispatch(addDeposit({ amount, transactionNo, status: 1 })) // status 1 : success
      window.history.replaceState({}, "", "http://localhost:9000/")
      toast.success("Bạn đã nạp tiền thành công")
    }
  })


  // Define your carousel items
  const carouselItems = [
    {
      src: 'https://www.parents.com/thmb/--pZafKsgGSb8NrJVrV7lqJId9g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/BirthdayParty-GettyImages-1600792233-c2a961509556414f9f41b92b8471a551.jpg',
      altText: 'Party Room 1',
      caption: 'Great space!',
    },
    {
      src: 'https://berkscountyliving.com/downloads/18196/download/iStock-918933880.jpg?cb=1155e4a7652ab617e102986ad35ab972',
      altText: 'Party Room 2',
      caption: 'The best service!',
    },
    {
      src: 'https://st3.depositphotos.com/1002111/14176/i/1600/depositphotos_141766842-stock-photo-happy-kids-birthday.jpg',
      altText: 'Party Room 3',
      caption: 'Convenient!',
    },
    // Add more carousel items as needed
  ];

  //Ảnh tạm để hiển thị từng cái phòng dưới home
  const sampleRoomImgs = [
    {
      src: 'https://a0.muscache.com/im/pictures/hosting/Hosting-1043166044341014938/original/4156904a-dd6e-4935-84d7-cdbb0d75d0fc.jpeg?im_w=960',
      altText: 'Party Room 1',
      caption: 'Không gian tuyệt vời!',
    },
    {
      src: 'https://a0.muscache.com/im/pictures/c822f7cd-b3fa-494f-9fd0-03c0f1e7ce61.jpg?im_w=960',
      altText: 'Party Room 2',
      caption: 'Dịch vụ hấp dẫn!',
    },
    {
      src: 'https://a0.muscache.com/im/pictures/miso/Hosting-1004014936348720309/original/5c266bac-5852-441f-bebf-47d8de5fd363.jpeg?im_w=960',
      altText: 'Party Room 3',
      caption: 'Phục vụ chu đáo!',
    },
    {
      src: 'https://a0.muscache.com/im/pictures/2624b5de-1d28-460d-87e4-827bf97c6fcf.jpg?im_w=960',
      altText: 'Party Room 3',
      caption: 'Phục vụ chu đáo!',
    },
    {
      src: 'https://a0.muscache.com/im/pictures/a8ceccf6-6c64-423a-b0f3-c476d07e28e6.jpg?im_w=960',
      altText: 'Party Room 3',
      caption: 'Phục vụ chu đáo!',
    },
    {
      src: 'https://a0.muscache.com/im/pictures/miso/Hosting-1065136567884295328/original/e69cf2bf-8aec-49d0-a628-676c481fab91.png?im_w=960',
      altText: 'Party Room 3',
      caption: 'Phục vụ chu đáo!',
    },
    // Add more carousel items as needed
  ];


  // style for banner 
  const imagesStyle: React.CSSProperties = {
    width: "100%",
    height: "70vh",
    objectFit: "cover"
  }

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


  // console.log(localStorage.getItem("user").split(`"`).join(``));

  return (

    <div className='home-page'>
      <Row>
        {/* <Col md="6">
          <h1 className="display-4">Khám phá các bữa tiệc nào!!!</h1>
          <p className="lead">Hãy tìm điểm dừng chân tiếp theo cho bữa tiệc hoành tráng của bạn.</p>
          {userExisted != null ? (
            <Alert color="success">Chào mừng {userExisted ? userExisted.split(`"`).join(``) : ""} đến với chúng tôi!</Alert>
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
        </Col> */}
        <Col md="12">
          {/* Carousel component */}
          <Carousel activeIndex={activeIndex} next={next} previous={previous}>
            <CarouselIndicators
              items={carouselItems}
              activeIndex={activeIndex}
              onClickHandler={(index) => setActiveIndex(index)}
            />
            {carouselItems.map((item, index) => (
              <CarouselItem key={index}>
                <img src={item.src} alt={item.altText} style={imagesStyle} />
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


      {/* <Row className="mt-4"> */}
      {/* Add more destinations as needed */}
      {/* <Col md="12">
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
          </ul>
        </Col> */}
      {/* </Row> */}

      <Row className='mt-4'>
        <Col>
          <div>
            {roomList && roomList.length > 0 ? (
              <Grid container spacing={3} mb={4} wrap='wrap'>
                {roomList.map((item) => (
                  <Grid item key={item.id} xs={12} sm={6} md={4} xl={3}>
                    <Paper className="apartment-card" component={Link} to={`/room/detail/${item.id}`} style={{ textDecoration: 'none' }} elevation={3}>
                      {/* Slick Carousel for images */}
                      <div className='slider-container'>
                        <Slider {...slickSettings}>
                          {sampleRoomImgs.sort(() => Math.random() - 0.5).map((carouselItem, index) => (
                            <CardMedia className='img-room img' key={index} image={carouselItem.src}>
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
                          <strong>{formatCurrency(item.price)}</strong> / hour
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
        </Col>
      </Row>
    </div>
  );
};

export default Home;