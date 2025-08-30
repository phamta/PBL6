'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Users, UserPlus, Shield, Settings, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import PermissionGate from '../../../../components/auth/PermissionGate';
import { usePermissions, UserRole } from '@/hooks/usePermissions';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  department?: string;
  status: string;
  createdAt: string;
}

const roleColors = {
  'admin': 'bg-red-100 text-red-800',
  'user': 'bg-blue-100 text-blue-800',
  'student': 'bg-green-100 text-green-800',
  'specialist': 'bg-purple-100 text-purple-800',
  'manager': 'bg-orange-100 text-orange-800',
  'viewer': 'bg-gray-100 text-gray-800',
  'system': 'bg-yellow-100 text-yellow-800',
};

const statusColors = {
  'active': 'bg-green-100 text-green-800',
  'inactive': 'bg-gray-100 text-gray-800',
  'banned': 'bg-red-100 text-red-800',
};

export default function RoleManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    password: '',
    role: 'user',
    department: '',
  });

  const { getRoleDisplayName, can } = usePermissions();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/v1/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        toast.error('Không thể tải danh sách người dùng');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Lỗi kết nối server');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3001/api/v1/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        toast.success('Tạo người dùng thành công');
        setIsCreateModalOpen(false);
        setNewUser({
          email: '',
          fullName: '',
          password: '',
          role: 'user',
          department: '',
        });
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Không thể tạo người dùng');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Lỗi kết nối server');
    }
  };

  const assignRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/api/v1/users/${userId}/assign-role`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success('Phân quyền thành công');
        fetchUsers();
      } else {
        toast.error('Không thể phân quyền');
      }
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Lỗi kết nối server');
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:3001/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Xóa người dùng thành công');
        fetchUsers();
      } else {
        toast.error('Không thể xóa người dùng');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Lỗi kết nối server');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <PermissionGate permission="user:read">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Phân quyền</h1>
            <p className="text-muted-foreground">
              Quản lý tài khoản người dùng và phân quyền hệ thống
            </p>
          </div>
          <PermissionGate permission="user:create">
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Tạo tài khoản
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tạo tài khoản mới</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input
                      id="fullName"
                      value={newUser.fullName}
                      onChange={(e) => setNewUser(prev => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Vai trò</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Người dùng cơ sở</SelectItem>
                        <SelectItem value="student">Sinh viên/Học viên quốc tế</SelectItem>
                        <SelectItem value="specialist">Chuyên viên HTQT/KHCN&ĐN</SelectItem>
                        <SelectItem value="manager">Lãnh đạo Phòng</SelectItem>
                        <SelectItem value="viewer">Người dùng tra cứu</SelectItem>
                        <PermissionGate permission="user:assign_role">
                          <SelectItem value="admin">Admin CNTT</SelectItem>
                        </PermissionGate>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="department">Phòng/Khoa</Label>
                    <Input
                      id="department"
                      value={newUser.department}
                      onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                    Hủy
                  </Button>
                  <Button onClick={createUser}>
                    Tạo tài khoản
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </PermissionGate>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Danh sách người dùng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  <SelectItem value="admin">Admin CNTT</SelectItem>
                  <SelectItem value="user">Người dùng cơ sở</SelectItem>
                  <SelectItem value="student">Sinh viên/Học viên</SelectItem>
                  <SelectItem value="specialist">Chuyên viên</SelectItem>
                  <SelectItem value="manager">Lãnh đạo</SelectItem>
                  <SelectItem value="viewer">Tra cứu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Phòng/Khoa</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Đang tải...
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Không có dữ liệu
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-semibold">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleColors[user.role as keyof typeof roleColors]}>
                            {getRoleDisplayName(user.role as any)}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.department || '-'}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[user.status as keyof typeof statusColors]}>
                            {user.status === 'active' ? 'Hoạt động' : 
                             user.status === 'inactive' ? 'Không hoạt động' : 'Bị cấm'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <PermissionGate permission="user:assign_role">
                              <Select
                                value={user.role}
                                onValueChange={(newRole) => assignRole(user.id, newRole)}
                              >
                                <SelectTrigger className="w-32">
                                  <Shield className="h-4 w-4 mr-1" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Người dùng</SelectItem>
                                  <SelectItem value="student">Sinh viên</SelectItem>
                                  <SelectItem value="specialist">Chuyên viên</SelectItem>
                                  <SelectItem value="manager">Lãnh đạo</SelectItem>
                                  <SelectItem value="viewer">Tra cứu</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </PermissionGate>
                            
                            <PermissionGate permission="user:delete">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </PermissionGate>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}
