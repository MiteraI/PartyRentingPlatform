import dayjs from 'dayjs';
import { IRoom } from 'app/shared/model/room.model';
import { IUser } from 'app/shared/model/user.model';

export interface IReport {
  id?: number;
  title?: string | null;
  description?: string | null;
  sentTime?: dayjs.Dayjs | null;
  room?: IRoom | null;
  user?: IUser;
}

export const defaultValue: Readonly<IReport> = {};
