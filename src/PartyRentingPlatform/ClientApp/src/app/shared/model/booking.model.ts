import dayjs from 'dayjs';
import { IRoom } from 'app/shared/model/room.model';
import { IBookingDetails } from 'app/shared/model/booking-details.model';
import { IUser } from 'app/shared/model/user.model';
import { BookingStatus } from 'app/shared/model/enumerations/booking-status.model';

export interface IBooking {
  id?: number;
  customerName?: string | null;
  bookTime?: dayjs.Dayjs | string;
  startTime?: dayjs.Dayjs | string;
  endTime?: dayjs.Dayjs | string;
  totalPrice?: number;
  status?: keyof typeof BookingStatus | null;
  rating?: number | null;
  comment?: string | null;
  room?: IRoom | null;
  roomId?: number | null;
  bookingDetails?: IBookingDetails[] | null;
  user?: IUser;
}

export const defaultValue: Readonly<IBooking> = {};
