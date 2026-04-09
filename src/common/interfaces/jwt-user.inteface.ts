import { Role } from '../enums/role.enum';

export interface JwtUser {
  userId: number;
  role: Role;
}