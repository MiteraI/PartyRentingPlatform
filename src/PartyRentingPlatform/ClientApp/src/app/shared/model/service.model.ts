import { IRoom } from 'app/shared/model/room.model';

export interface IService {
  id?: number;
  serviceName?: string;
  price?: number | null;
  description?: string | null;
  rooms?: IRoom[] | null;
}

export const defaultValue: Readonly<IService> = {};
