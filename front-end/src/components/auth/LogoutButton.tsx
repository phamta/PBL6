'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { authHelpers } from '@/lib/auth';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function LogoutButton({ 
  variant = 'default', 
  size = 'default',
  fullWidth = false,
  showIcon = true,
  children
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      
      // Clear authentication data
      authHelpers.removeToken();
      authHelpers.removeUser();
      
      // Small delay to ensure cleanup
      setTimeout(() => {
        router.push('/login');
      }, 100);
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoading}
      className={fullWidth ? 'w-full' : ''}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {children || (isLoading ? 'Đang đăng xuất...' : 'Đăng xuất')}
    </Button>
  );
}