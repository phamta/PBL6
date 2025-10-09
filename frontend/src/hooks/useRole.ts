/**
 * useRole Hook - Custom hook để làm việc với roles
 */

'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  hasRole,
  hasAnyRole,
  getPrimaryRole,
  getPrimaryRoleName,
  getDashboardRoute,
  isAdmin,
  isStaff,
  isStudent,
  getAllRoleCodes,
  getAllRoleNames,
  RoleCode,
} from '@/lib/auth/roles';

export function useRole() {
  const { user } = useAuth();

  const roleInfo = useMemo(() => {
    return {
      // User info
      user,
      
      // Role checks
      hasRole: (roleCode: RoleCode | string) => hasRole(user, roleCode),
      hasAnyRole: (roleCodes: (RoleCode | string)[]) => hasAnyRole(user, roleCodes),
      
      // Primary role
      primaryRole: getPrimaryRole(user),
      primaryRoleName: getPrimaryRoleName(user),
      
      // Dashboard route
      dashboardRoute: getDashboardRoute(user),
      
      // Quick checks
      isAdmin: isAdmin(user),
      isStaff: isStaff(user),
      isStudent: isStudent(user),
      
      // All roles
      allRoleCodes: getAllRoleCodes(user),
      allRoleNames: getAllRoleNames(user),
    };
  }, [user]);

  return roleInfo;
}

export default useRole;
