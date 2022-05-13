import { Roles,SystemRoles } from '../../../constants/Enums';

import { SetMetadata } from '@nestjs/common';
/**
 * Allow only specified roles to access a specific route, leaving empty means allows everyone
 * @param roles
 * @constructor
 */
export const RolesAllowed = (...roles: Roles[]) => SetMetadata('roles', roles);
