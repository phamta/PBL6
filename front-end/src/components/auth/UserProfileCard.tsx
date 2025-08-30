'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Settings, 
  LogOut,
  UserCircle
} from 'lucide-react';
import { authHelpers } from '@/lib/auth';
import { usePermissions } from '@/hooks/usePermissions';
import { LogoutButton } from './LogoutButton';

interface UserProfileCardProps {
  onClose?: () => void;
}

export function UserProfileCard({ onClose }: UserProfileCardProps) {
  const { userRole, getRoleDisplayName } = usePermissions();
  const user = authHelpers.getUser();

  if (!user) {
    return (
      <Card className="w-80">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Chưa đăng nhập
          </div>
        </CardContent>
      </Card>
    );
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-purple-100 text-purple-800';
      case 'specialist':
        return 'bg-blue-100 text-blue-800';
      case 'user':
        return 'bg-green-100 text-green-800';
      case 'student':
        return 'bg-orange-100 text-orange-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-80 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <UserCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-base">
              {user.fullName || user.name || 'Người dùng'}
            </CardTitle>
            <Badge className={`mt-1 ${getRoleColor(userRole)}`}>
              {getRoleDisplayName(userRole)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.phone}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{user.username || 'N/A'}</span>
          </div>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={onClose}
          >
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt tài khoản
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full justify-start"
            onClick={onClose}
          >
            <Shield className="h-4 w-4 mr-2" />
            Bảo mật
          </Button>
        </div>
        
        <Separator />
        
        <LogoutButton 
          variant="destructive" 
          size="sm" 
          fullWidth={true}
          showIcon={true}
        />
      </CardContent>
    </Card>
  );
}