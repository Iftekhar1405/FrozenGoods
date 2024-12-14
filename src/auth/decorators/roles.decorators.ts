import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../models/user.model";

export const ROLES_KEYS = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEYS, roles);
