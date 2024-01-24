import { IRoom } from 'app/shared/model/room.model';

export interface IRoomImage {
  id?: number;
  imageUrl?: string | null;
  room?: IRoom | null;
}

export const defaultValue: Readonly<IRoomImage> = {};
