import { Permission } from './permission';
import { Role } from './role';
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
  two_factor_auth: boolean;
  auth_code: string;
  token: string;
  last_logon: string;
  created_at: string;
  updated_at: string;
  language: string;
}
