import dayjs from 'dayjs';
import { IUser } from 'app/shared/model/user.model';
import { NotificationType } from 'app/shared/model/enumerations/notification-type.model';

export interface INotification {
  id?: number;
  title?: string | null;
  description?: string | null;
  sentTime?: dayjs.Dayjs | null;
  enum?: keyof typeof NotificationType | null;
  user?: IUser;
}

export const defaultValue: Readonly<INotification> = {};
