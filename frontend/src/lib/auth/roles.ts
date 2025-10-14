/**
 * Role Helper - Utilities để xác định role của user
 */

import { User } from '@/lib/api/types';

export enum RoleCode {
  SYSTEM_ADMIN = 'system_admin',
  DEPARTMENT_OFFICER = 'department_officer',
  LEADERSHIP = 'leadership',
  FACULTY_STAFF = 'faculty_staff',
  STUDENT = 'student',
}

export enum RoleName {
  SYSTEM_ADMIN = 'Quản trị hệ thống',
  DEPARTMENT_OFFICER = 'Cán bộ phòng',
  LEADERSHIP = 'Lãnh đạo',
  FACULTY_STAFF = 'Cán bộ khoa/viện',
  STUDENT = 'Sinh viên',
}

/**
 * Kiểm tra user có role cụ thể không
 */
export function hasRole(user: User | null, roleCode: RoleCode | string): boolean {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    console.warn('⚠️ hasRole: User hoặc roles không hợp lệ:', user);
    return false;
  }
  
  return user.roles.some(ur => 
    ur.role && ur.role.code && ur.role.code.toLowerCase() === roleCode.toLowerCase()
  );
}

/**
 * Kiểm tra user có bất kỳ role nào trong list
 */
export function hasAnyRole(user: User | null, roleCodes: (RoleCode | string)[]): boolean {
  if (!user || !user.roles) return false;
  
  return user.roles.some(ur => 
    roleCodes.some(code => ur.role.code.toLowerCase() === code.toLowerCase())
  );
}

/**
 * Lấy role code chính (priority cao nhất) của user
 */
export function getPrimaryRole(user: User | null): RoleCode | null {
  if (!user || !user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    console.warn('⚠️ getPrimaryRole: User không có roles:', user);
    return null;
  }
  
  const rolePriority = [
    RoleCode.SYSTEM_ADMIN,
    RoleCode.DEPARTMENT_OFFICER,
    RoleCode.LEADERSHIP,
    RoleCode.FACULTY_STAFF,
    RoleCode.STUDENT,
  ];
  
  for (const roleCode of rolePriority) {
    if (hasRole(user, roleCode)) {
      return roleCode;
    }
  }
  
  return null;
}

/**
 * Lấy tên role chính của user
 */
export function getPrimaryRoleName(user: User | null): string {
  const primaryRole = getPrimaryRole(user);
  
  if (!primaryRole) return 'Chưa có vai trò';
  
  switch (primaryRole) {
    case RoleCode.SYSTEM_ADMIN:
      return RoleName.SYSTEM_ADMIN;
    case RoleCode.DEPARTMENT_OFFICER:
      return RoleName.DEPARTMENT_OFFICER;
    case RoleCode.LEADERSHIP:
      return RoleName.LEADERSHIP;
    case RoleCode.FACULTY_STAFF:
      return RoleName.FACULTY_STAFF;
    case RoleCode.STUDENT:
      return RoleName.STUDENT;
    default:
      return 'Chưa xác định';
  }
}

/**
 * Lấy dashboard route dựa trên role
 */
export function getDashboardRoute(user: User | null): string {
  console.log('🔍 getDashboardRoute called with user:', user);
  
  const primaryRole = getPrimaryRole(user);
  console.log('🎭 Primary role:', primaryRole);
  
  switch (primaryRole) {
    case RoleCode.SYSTEM_ADMIN:
      console.log('✅ Redirecting to admin dashboard');
      return '/dashboard/admin';
    case RoleCode.DEPARTMENT_OFFICER:
      console.log('✅ Redirecting to department officer dashboard');
      return '/dashboard/officer';
    case RoleCode.LEADERSHIP:
      console.log('✅ Redirecting to leadership dashboard');
      return '/dashboard/leadership';
    case RoleCode.FACULTY_STAFF:
      console.log('✅ Redirecting to staff dashboard');
      return '/dashboard/staff';
    case RoleCode.STUDENT:
      console.log('✅ Redirecting to student dashboard');
      return '/dashboard/student';
    default:
      console.log('⚠️ No specific role found, redirecting to default dashboard');
      return '/dashboard';
  }
}

/**
 * Kiểm tra user có phải admin không
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, RoleCode.SYSTEM_ADMIN);
}

/**
 * Kiểm tra user có phải staff không (bao gồm cả admin)
 */
export function isStaff(user: User | null): boolean {
  return hasAnyRole(user, [
    RoleCode.FACULTY_STAFF
  ]);
}

/**
 * Kiểm tra user có phải student không
 */
export function isStudent(user: User | null): boolean {
  return hasRole(user, RoleCode.STUDENT);
}

export function isOfficer(user: User | null): boolean {
  return hasRole(user, RoleCode.DEPARTMENT_OFFICER);
}
export function isLeadership(user: User | null): boolean {
  return hasRole(user, RoleCode.LEADERSHIP);
}

/**
 * Lấy tất cả role codes của user
 */
export function getAllRoleCodes(user: User | null): string[] {
  if (!user || !user.roles || !Array.isArray(user.roles)) return [];
  return user.roles.map(ur => ur.role?.code || '').filter(code => code);
}

/**
 * Lấy tất cả role names của user
 */
export function getAllRoleNames(user: User | null): string[] {
  if (!user || !user.roles || !Array.isArray(user.roles)) return [];
  return user.roles.map(ur => ur.role?.name || '').filter(name => name);
}
