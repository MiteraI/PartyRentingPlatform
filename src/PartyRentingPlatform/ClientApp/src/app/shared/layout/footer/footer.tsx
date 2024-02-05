// Footer.tsx

import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import './Footer.scss';

const Footer = () => (
  <div className="footer">
    <Container>
    <Row>
        <Col md="12">
          <p></p>
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <h5>Khám phá ngay</h5>
          <ul>
            <li>Địa điểm cho thuê nổi bậc TP HCM</li>
            <li>Các dịch vụ đi kèm hấp dẫn</li>
            <li>Places to stay</li>
          </ul>
        </Col>
        <Col md="4">
          <h5>Về chúng tôi</h5>
          <ul>
            <li>Party team</li>
            <li>Hợp tác cho thuê phòng</li>
            <li>Airbnb Plus</li>
          </ul>
        </Col>
        <Col md="4">
          <h5>Connect</h5>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>Instagram</li>
          </ul>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md="12">
          <p>&copy; 2024 Party Team. All rights reserved.</p>
        </Col>
      </Row>
    </Container>
  </div>
);

export default Footer;
