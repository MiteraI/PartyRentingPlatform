import { IService } from 'app/shared/model/service.model';
import { IBooking } from 'app/shared/model/booking.model';

export interface IBookingDetails {
  id?: number;
  serviceQuantity?: number | null;
  service?: IService;
  serviceId?: number | null;
  booking?: IBooking | null;
}

export const defaultValue: Readonly<IBookingDetails> = {};
