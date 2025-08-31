'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User, Role, adminApi } from '@/lib/admin-api';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';

interface ManageRolesModalProps {
  user: User;
  roles: Role[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function ManageRolesModal({ user, roles, onSuccess, onCancel }: ManageRolesModalProps) {
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [loading, setLoading] = useState(false);

  const userRoleIds = user.roles?.map(role => role.id) || [];
  const availableRoles = roles.filter(role => !userRoleIds.includes(role.id));

  const handleAssignRole = async () => {
    if (!selectedRoleId) return;

    setLoading(true);
    try {
      await adminApi.assignRole(user.id, selectedRoleId);
      toast.success('Gán vai trò thành công');
      setSelectedRoleId('');
      onSuccess();
    } catch (error) {
      toast.error('Không thể gán vai trò');
      console.error('Assign role error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRole = async (roleId: string) => {
    if (!confirm('Bạn có chắc chắn muốn thu hồi vai trò này?')) {
      return;
    }

    setLoading(true);
    try {
      await adminApi.removeRole(user.id, roleId);
      toast.success('Thu hồi vai trò thành công');
      onSuccess();
    } catch (error) {
      toast.error('Không thể thu hồi vai trò');
      console.error('Remove role error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-purple-100 text-purple-800';
      case 'specialist': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-green-100 text-green-800';
      case 'student': return 'bg-orange-100 text-orange-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          Quản lý vai trò cho: <strong>{user.fullName}</strong> ({user.username})
        </p>
      </div>

      {/* Current roles */}
      <div className="space-y-2">
        <h4 className="font-medium">Vai trò hiện tại:</h4>
        {user.roles && user.roles.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.roles.map((role) => (
              <div key={role.id} className="flex items-center gap-1">
                <Badge className={getRoleBadgeColor(role.roleName)}>
                  {role.roleName}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleRemoveRole(role.id)}
                  disabled={loading}
                  className="h-6 w-6 p-0 hover:bg-red-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Chưa có vai trò nào</p>
        )}
      </div>

      {/* Assign new role */}
      {availableRoles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Gán vai trò mới:</h4>
          <div className="flex gap-2">
            <Select value={selectedRoleId} onValueChange={setSelectedRoleId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.roleName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssignRole}
              disabled={!selectedRoleId || loading}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Gán
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Đóng
        </Button>
      </div>
    </div>
  );
}
