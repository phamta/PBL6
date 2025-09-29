import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ACTION_KEY = 'requireAction';

/**
 * Decorator to require a specific action for accessing an endpoint
 * @param actionCode - The action code required (e.g., 'USER_CREATE', 'ROLE_DELETE')
 */
export const RequireAction = (actionCode: string) => SetMetadata(REQUIRE_ACTION_KEY, actionCode);