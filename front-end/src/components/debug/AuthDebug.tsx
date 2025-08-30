'use client';

import { useState } from 'react';
import { authHelpers } from '@/lib/auth';
import { usePermissions } from '@/hooks/usePermissions';

export function AuthDebug() {
  const [isOpen, setIsOpen] = useState(false);
  const { userRole, getRoleDisplayName } = usePermissions();
  const user = authHelpers.getUser();
  const token = authHelpers.getToken();

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-lg hover:bg-blue-700"
        >
          Debug Auth
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border shadow-lg rounded-lg p-4 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-sm">Debug Info</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-xs"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <strong>Role:</strong> {userRole || 'None'}
        </div>
        <div>
          <strong>Display:</strong> {getRoleDisplayName(userRole)}
        </div>
        <div>
          <strong>User:</strong> {user?.email || 'Not logged in'}
        </div>
        <div>
          <strong>Token:</strong> {token ? 'Present' : 'None'}
        </div>
        <div>
          <strong>Name:</strong> {user?.fullName || user?.name || 'N/A'}
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t">
        <button
          onClick={() => {
            authHelpers.logout();
          }}
          className="text-red-600 hover:text-red-800 text-xs font-medium"
        >
          Force Logout
        </button>
      </div>
    </div>
  );
}