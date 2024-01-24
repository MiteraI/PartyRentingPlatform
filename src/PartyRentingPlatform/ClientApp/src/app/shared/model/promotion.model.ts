import dayjs from 'dayjs';
import { IRoom } from 'app/shared/model/room.model';

export interface IPromotion {
  id?: number;
  startTime?: dayjs.Dayjs;
  endTime?: dayjs.Dayjs;
  discount?: number;
  minimum?: number | null;
  rooms?: IRoom[] | null;
}

export const defaultValue: Readonly<IPromotion> = {};
