import room from 'app/entities/room/room.reducer';
import roomImage from 'app/entities/room-image/room-image.reducer';
import service from 'app/entities/service/service.reducer';
import promotion from 'app/entities/promotion/promotion.reducer';
import booking from 'app/entities/booking/booking.reducer';
import bookingDetails from 'app/entities/booking-details/booking-details.reducer';
import report from 'app/entities/report/report.reducer';
import notification from 'app/entities/notification/notification.reducer';
import wallet from "app/entities/wallet/wallet.reducer"
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  room,
  roomImage,
  service,
  promotion,
  booking,
  bookingDetails,
  report,
  notification,
  wallet
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
