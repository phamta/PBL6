'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface PermissionGateProps {
  children: ReactNode;
  requiredRole?: string;
  requiredPermission?: string;
  permission?: string; // Alternative prop name for compatibility
  fallback?: ReactNode;
}

export default function PermissionGate({ 
  children, 
  requiredRole, 
  requiredPermission, 
  permission,
  fallback 
}: PermissionGateProps) {
  const { user } = useAuth();

  if (!user) {
    return fallback || null;
  }

  // Check role-based access
  if (requiredRole && user.role !== requiredRole) {
    return fallback || null;
  }

  // For now, simple role-based check
  // In a more complex system, you would check specific permissions
  const permissionToCheck = requiredPermission || permission;
  if (permissionToCheck) {
    // This would check against user permissions in a real implementation
    // For now, we'll allow access for all authenticated users
    // In production, you would implement proper permission checking here
  }

  return <>{children}</>;
}
