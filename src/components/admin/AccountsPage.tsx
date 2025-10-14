"use client";

import React from "react";
import { useState } from "react";
import {
  UserCog,
  Search,
  UserPlus,
  Edit,
  Trash,
  Shield,
  Key,
} from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { InputPassword } from "../ui/input-password";

const usersData = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@system.com",
    role: "Super Admin",
    status: "active",
    password: "********",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@university.edu",
    role: "Manager",
    status: "active",
    password: "********",
    createdAt: "2024-03-20",
  },
  {
    id: 3,
    name: "Maria Garcia",
    email: "maria.garcia@university.edu",
    role: "Coordinator",
    status: "active",
    password: "********",
    createdAt: "2024-05-10",
  },
  {
    id: 4,
    name: "Chen Wei",
    email: "chen.wei@university.edu",
    role: "Staff",
    status: "active",
    password: "********",
    createdAt: "2024-06-15",
  },
  {
    id: 5,
    name: "Sophie Dubois",
    email: "sophie.dubois@university.edu",
    role: "Staff",
    status: "inactive",
    password: "********",
    createdAt: "2024-02-28",
  },
  {
    id: 6,
    name: "Ahmed Hassan",
    email: "ahmed.hassan@university.edu",
    role: "Viewer",
    status: "active",
    password: "********",
    createdAt: "2024-08-05",
  },
  {
    id: 7,
    name: "Anna Kowalski",
    email: "anna.kowalski@university.edu",
    role: "Coordinator",
    status: "active",
    password: "********",
    createdAt: "2024-07-12",
  },
  {
    id: 8,
    name: "Raj Patel",
    email: "raj.patel@university.edu",
    role: "Staff",
    status: "active",
    password: "********",
    createdAt: "2024-09-01",
  },
];

const defaultPassword = "P@ssw0rd!";

export function AccountsPage() {
  const [selectedUser, setSelectedUser] = useState<
    (typeof usersData)[0] | null
  >(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant={status === "active" ? "default" : "secondary"}>
        {status === "active" ? "Active" : "Inactive"}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      "Super Admin": "bg-red-100 text-red-700",
      Manager: "bg-purple-100 text-purple-700",
      Coordinator: "bg-blue-100 text-blue-700",
      Staff: "bg-green-100 text-green-700",
      Viewer: "bg-gray-100 text-gray-700",
    };
    return (
      <Badge variant="outline" className={colors[role] || ""}>
        {role}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Quản lý người dùng" }]} />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage system users and their access levels
          </p>
        </div>
        <Button className="bg-primary" onClick={() => setIsAddUserOpen(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          Change Default Password
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Shield className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Coordinator">Coordinator</SelectItem>
              <SelectItem value="Staff">Staff</SelectItem>
              <SelectItem value="Viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Password</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 bg-primary text-primary-foreground">
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p>{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {user.id}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.password}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full px-4"
                      onClick={() => alert(`Reset password for ${user.name}`)}
                    >
                      <Key className="w-4 h-4 mr-2 text-[#1E88E5]" />
                      Reset Password
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="max-w-md dialog-content">
          <DialogHeader>
            <DialogTitle>Change Default Password</DialogTitle>
            <DialogDescription>
              Change the default password for your account to enhance security.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-default-password">
                Mật khẩu mặc định hiện tại
              </Label>
              <InputPassword
                id="current-default-password"
                value={defaultPassword}
                readOnly
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="new-default-password">
                Mật khẩu mặc định mới
              </Label>
              <InputPassword
                id="new-default-password"
                placeholder="Nhập mật khẩu mặc định mới"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="confirm-default-password">
                Nhập lại mật khẩu mặc định mới
              </Label>
              <InputPassword
                id="confirm-default-password"
                placeholder="Nhập lại mật khẩu mặc định mới"
                className="mt-2"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary">Đổi mật khẩu</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
