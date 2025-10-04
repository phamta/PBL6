"use client";

import React from "react";
import { useState } from "react";
import { Shield, Plus, Edit, Trash, Check, X } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const rolesData = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full system access with all permissions",
    userCount: 2,
    color: "bg-red-100 text-red-700",
  },
  {
    id: 2,
    name: "Manager",
    description: "Manage documents, delegations, and approve requests",
    userCount: 5,
    color: "bg-purple-100 text-purple-700",
  },
  {
    id: 3,
    name: "Coordinator",
    description: "Coordinate international programs and manage members",
    userCount: 8,
    color: "bg-blue-100 text-blue-700",
  },
  {
    id: 4,
    name: "Staff",
    description: "Basic access to view and create requests",
    userCount: 15,
    color: "bg-green-100 text-green-700",
  },
  {
    id: 5,
    name: "Viewer",
    description: "Read-only access to system information",
    userCount: 12,
    color: "bg-gray-100 text-gray-700",
  },
];

const permissionsData = [
  {
    module: "Documents",
    permissions: [
      { id: "doc_view", name: "View Documents" },
      { id: "doc_create", name: "Create Documents" },
      { id: "doc_edit", name: "Edit Documents" },
      { id: "doc_delete", name: "Delete Documents" },
      { id: "doc_approve", name: "Approve Documents" },
    ],
  },
  {
    module: "Delegations",
    permissions: [
      { id: "del_view", name: "View Delegations" },
      { id: "del_create", name: "Create Delegations" },
      { id: "del_edit", name: "Edit Delegations" },
      { id: "del_approve", name: "Approve Delegations" },
    ],
  },
  {
    module: "International Members",
    permissions: [
      { id: "int_view", name: "View Members" },
      { id: "int_create", name: "Add Members" },
      { id: "int_edit", name: "Edit Members" },
      { id: "int_delete", name: "Delete Members" },
    ],
  },
  {
    module: "Translations",
    permissions: [
      { id: "trans_view", name: "View Requests" },
      { id: "trans_create", name: "Submit Requests" },
      { id: "trans_approve", name: "Approve Requests" },
    ],
  },
  {
    module: "Users & Roles",
    permissions: [
      { id: "user_view", name: "View Users" },
      { id: "user_create", name: "Create Users" },
      { id: "user_edit", name: "Edit Users" },
      { id: "user_delete", name: "Delete Users" },
      { id: "role_manage", name: "Manage Roles" },
    ],
  },
];

export function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<typeof rolesData[0] | null>(null);
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>Role & Permission Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage roles and configure access permissions
          </p>
        </div>
        <Button className="bg-primary" onClick={() => setIsAddRoleOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Role
        </Button>
      </div>

      {/* Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rolesData.map((role) => (
          <Card key={role.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <Badge variant="outline" className={role.color}>
                {role.userCount} users
              </Badge>
            </div>
            <h3 className="mb-2">{role.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {role.description}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedRole(role)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {role.id > 2 && (
                <Button size="sm" variant="ghost">
                  <Trash className="w-4 h-4 text-destructive" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card className="p-6">
        <div className="mb-6">
          <h2>Permissions Matrix</h2>
          <p className="text-muted-foreground mt-1">
            Configure role-based access control for each module
          </p>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Module / Permission</TableHead>
                {rolesData.map((role) => (
                  <TableHead key={role.id} className="text-center">
                    <Badge variant="outline" className={role.color}>
                      {role.name}
                    </Badge>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissionsData.map((module) => (
                <>
                  <TableRow key={module.module} className="bg-muted/50">
                    <TableCell colSpan={6}>
                      <span>{module.module}</span>
                    </TableCell>
                  </TableRow>
                  {module.permissions.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell className="pl-8 text-muted-foreground">
                        {permission.name}
                      </TableCell>
                      {rolesData.map((role) => (
                        <TableCell key={`${permission.id}-${role.id}`} className="text-center">
                          <Checkbox
                            defaultChecked={
                              role.id === 1 ||
                              (role.id === 2 && !permission.id.includes("delete")) ||
                              (role.id === 3 && permission.id.includes("view"))
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-6 flex justify-end">
          <Button className="bg-primary">
            <Check className="w-4 h-4 mr-2" />
            Save Permissions
          </Button>
        </div>
      </Card>

      {/* Edit Role Dialog */}
      <Dialog
        open={!!selectedRole}
        onOpenChange={(open) => !open && setSelectedRole(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and description
            </DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  defaultValue={selectedRole.name}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="role-description">Description</Label>
                <Textarea
                  id="role-description"
                  defaultValue={selectedRole.description}
                  className="mt-2"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  This role is currently assigned to{" "}
                  <span className="font-medium text-foreground">
                    {selectedRole.userCount} users
                  </span>
                </p>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelectedRole(null)}>
                  Cancel
                </Button>
                <Button className="bg-primary">
                  <Check className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Role Dialog */}
      <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role and configure its permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-role-name">Role Name</Label>
              <Input
                id="new-role-name"
                placeholder="Enter role name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="new-role-description">Description</Label>
              <Textarea
                id="new-role-description"
                placeholder="Describe the purpose and scope of this role"
                className="mt-2"
              />
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm">
                After creating the role, configure its permissions in the
                Permissions Matrix below.
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Role
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}