import { IRoomImage } from 'app/shared/model/room-image.model';
import { IUser } from 'app/shared/model/user.model';
import { IPromotion } from 'app/shared/model/promotion.model';
import { IService } from 'app/shared/model/service.model';
import { RoomStatus } from 'app/shared/model/enumerations/room-status.model';

export interface IRoom {
  id?: number;
  roomName?: string;
  address?: string;
  description?: string | null;
  price?: number;
  roomCapacity?: number;
  rating?: number | null;
  status?: keyof typeof RoomStatus | null;
  imageURLs?: IRoomImage[] | null;
  user?: IUser;
  promotions?: IPromotion[] | null;
  services?: IService[] | null;
}

export const defaultValue: Readonly<IRoom> = {};
