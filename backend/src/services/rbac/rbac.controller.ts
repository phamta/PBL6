import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseBoolPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { RequireAction } from '../../decorators/require-action.decorator';
import { RbacService } from './rbac.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  CreateActionDto,
  UpdateActionDto,
  AssignRoleToUserDto,
  AssignMultipleRolesDto,
  AssignPermissionToRoleDto,
  AssignMultiplePermissionsDto,
  AssignActionToPermissionDto,
  AssignMultipleActionsDto,
} from './dto';

@ApiTags('RBAC Management')
@ApiBearerAuth()
@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // ==================== ROLE ENDPOINTS ====================

  @Post('roles')
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 409, description: 'Role name or code already exists' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.rbacService.createRole(createRoleDto);
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get all roles' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  async getRoles(
    @Query('includeInactive', new DefaultValuePipe(false), ParseBoolPipe) 
    includeInactive: boolean,
  ) {
    return this.rbacService.getRoles(includeInactive);
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async getRoleById(@Param('id') id: string) {
    return this.rbacService.getRoleById(id);
  }

  @Put('roles/:id')
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 409, description: 'Role name or code already exists' })
  async updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rbacService.updateRole(id, updateRoleDto);
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'Delete role (soft delete)' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async deleteRole(@Param('id') id: string) {
    return this.rbacService.deleteRole(id);
  }

  // ==================== PERMISSION ENDPOINTS ====================

  @Post('permissions')
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiResponse({ status: 201, description: 'Permission created successfully' })
  @ApiResponse({ status: 409, description: 'Permission name or code already exists' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.rbacService.createPermission(createPermissionDto);
  }

  @Get('permissions')
  @ApiOperation({ summary: 'Get all permissions' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  async getPermissions(
    @Query('includeInactive', new DefaultValuePipe(false), ParseBoolPipe) 
    includeInactive: boolean,
  ) {
    return this.rbacService.getPermissions(includeInactive);
  }

  @Get('permissions/:id')
  @ApiOperation({ summary: 'Get permission by ID' })
  @ApiResponse({ status: 200, description: 'Permission found' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async getPermissionById(@Param('id') id: string) {
    return this.rbacService.getPermissionById(id);
  }

  @Put('permissions/:id')
  @ApiOperation({ summary: 'Update permission' })
  @ApiResponse({ status: 200, description: 'Permission updated successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  @ApiResponse({ status: 409, description: 'Permission name or code already exists' })
  async updatePermission(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.rbacService.updatePermission(id, updatePermissionDto);
  }

  @Delete('permissions/:id')
  @ApiOperation({ summary: 'Delete permission (soft delete)' })
  @ApiResponse({ status: 200, description: 'Permission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async deletePermission(@Param('id') id: string) {
    return this.rbacService.deletePermission(id);
  }

  // ==================== ACTION ENDPOINTS ====================

  @Post('actions')
  @ApiOperation({ summary: 'Create a new action' })
  @ApiResponse({ status: 201, description: 'Action created successfully' })
  @ApiResponse({ status: 409, description: 'Action code already exists' })
  async createAction(@Body() createActionDto: CreateActionDto) {
    return this.rbacService.createAction(createActionDto);
  }

  @Get('actions')
  @RequireAction('ACTION_READ')
  @ApiOperation({ summary: 'Get all actions' })
  @ApiQuery({ name: 'includeInactive', required: false, type: Boolean })
  @ApiQuery({ name: 'grouped', required: false, type: Boolean, description: 'Group actions by category' })
  async getActions(
    @Query('includeInactive', new DefaultValuePipe(false), ParseBoolPipe) 
    includeInactive: boolean,
    @Query('grouped', new DefaultValuePipe(false), ParseBoolPipe) 
    grouped: boolean,
  ) {
    if (grouped) {
      return this.rbacService.getActionsGroupedByCategory(includeInactive);
    }
    return this.rbacService.getActions(includeInactive);
  }

  @Get('actions/:id')
  @ApiOperation({ summary: 'Get action by ID' })
  @ApiResponse({ status: 200, description: 'Action found' })
  @ApiResponse({ status: 404, description: 'Action not found' })
  async getActionById(@Param('id') id: string) {
    return this.rbacService.getActionById(id);
  }

  @Put('actions/:id')
  @ApiOperation({ summary: 'Update action' })
  @ApiResponse({ status: 200, description: 'Action updated successfully' })
  @ApiResponse({ status: 404, description: 'Action not found' })
  @ApiResponse({ status: 409, description: 'Action code already exists' })
  async updateAction(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto) {
    return this.rbacService.updateAction(id, updateActionDto);
  }

  @Delete('actions/:id')
  @ApiOperation({ summary: 'Delete action (soft delete)' })
  @ApiResponse({ status: 200, description: 'Action deleted successfully' })
  @ApiResponse({ status: 404, description: 'Action not found' })
  async deleteAction(@Param('id') id: string) {
    return this.rbacService.deleteAction(id);
  }

  // ==================== ASSIGNMENT ENDPOINTS ====================

  @Post('users/:userId/roles')
  @ApiOperation({ summary: 'Assign role to user' })
  @ApiResponse({ status: 201, description: 'Role assigned successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  @ApiResponse({ status: 409, description: 'User already has this role' })
  async assignRoleToUser(
    @Param('userId') userId: string,
    @Body() assignDto: Omit<AssignRoleToUserDto, 'userId'>,
  ) {
    return this.rbacService.assignRoleToUser({ ...assignDto, userId });
  }

  @Delete('users/:userId/roles/:roleId')
  @ApiOperation({ summary: 'Remove role from user' })
  @ApiResponse({ status: 200, description: 'Role removed successfully' })
  @ApiResponse({ status: 404, description: 'Role assignment not found' })
  async removeRoleFromUser(@Param('userId') userId: string, @Param('roleId') roleId: string) {
    return this.rbacService.removeRoleFromUser(userId, roleId);
  }

  @Put('users/:userId/roles')
  @ApiOperation({ summary: 'Assign multiple roles to user (replaces existing)' })
  @ApiResponse({ status: 200, description: 'Roles assigned successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async assignMultipleRoles(
    @Param('userId') userId: string,
    @Body() assignDto: Omit<AssignMultipleRolesDto, 'userId'>,
  ) {
    return this.rbacService.assignMultipleRoles({ ...assignDto, userId });
  }

  @Post('roles/:roleId/permissions')
  @ApiOperation({ summary: 'Assign permission to role' })
  @ApiResponse({ status: 201, description: 'Permission assigned successfully' })
  @ApiResponse({ status: 404, description: 'Role or permission not found' })
  @ApiResponse({ status: 409, description: 'Role already has this permission' })
  async assignPermissionToRole(
    @Param('roleId') roleId: string,
    @Body() assignDto: Omit<AssignPermissionToRoleDto, 'roleId'>,
  ) {
    return this.rbacService.assignPermissionToRole({ ...assignDto, roleId });
  }

  @Delete('roles/:roleId/permissions/:permissionId')
  @ApiOperation({ summary: 'Remove permission from role' })
  @ApiResponse({ status: 200, description: 'Permission removed successfully' })
  @ApiResponse({ status: 404, description: 'Permission assignment not found' })
  async removePermissionFromRole(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.rbacService.removePermissionFromRole(roleId, permissionId);
  }

  @Put('roles/:roleId/permissions')
  @ApiOperation({ summary: 'Assign multiple permissions to role (replaces existing)' })
  @ApiResponse({ status: 200, description: 'Permissions assigned successfully' })
  @ApiResponse({ status: 404, description: 'Role or permission not found' })
  async assignMultiplePermissions(
    @Param('roleId') roleId: string,
    @Body() assignDto: Omit<AssignMultiplePermissionsDto, 'roleId'>,
  ) {
    return this.rbacService.assignMultiplePermissions({ ...assignDto, roleId });
  }

  @Post('permissions/:permissionId/actions')
  @ApiOperation({ summary: 'Assign action to permission' })
  @ApiResponse({ status: 201, description: 'Action assigned successfully' })
  @ApiResponse({ status: 404, description: 'Permission or action not found' })
  @ApiResponse({ status: 409, description: 'Permission already has this action' })
  async assignActionToPermission(
    @Param('permissionId') permissionId: string,
    @Body() assignDto: Omit<AssignActionToPermissionDto, 'permissionId'>,
  ) {
    return this.rbacService.assignActionToPermission({ ...assignDto, permissionId });
  }

  @Put('permissions/:permissionId/actions')
  @ApiOperation({ summary: 'Assign multiple actions to permission (replaces existing)' })
  @ApiResponse({ status: 200, description: 'Actions assigned successfully' })
  @ApiResponse({ status: 404, description: 'Permission or action not found' })
  async assignMultipleActions(
    @Param('permissionId') permissionId: string,
    @Body() assignDto: Omit<AssignMultipleActionsDto, 'permissionId'>,
  ) {
    return this.rbacService.assignMultipleActions({ ...assignDto, permissionId });
  }

  // ==================== UTILITY ENDPOINTS ====================

  @Get('users/:userId/permissions')
  @ApiOperation({ summary: 'Get user with all permissions' })
  @ApiResponse({ status: 200, description: 'User permissions retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserWithPermissions(@Param('userId') userId: string) {
    return this.rbacService.getUserWithPermissions(userId);
  }

  @Get('users/:userId/actions')
  @ApiOperation({ summary: 'Get all action codes for user' })
  @ApiResponse({ status: 200, description: 'User action codes retrieved' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserActionCodes(@Param('userId') userId: string) {
    return this.rbacService.getUserActionCodes(userId);
  }

  @Get('users/:userId/check/:actionCode')
  @ApiOperation({ summary: 'Check if user has specific permission' })
  @ApiResponse({ status: 200, description: 'Permission check result' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async checkUserPermission(
    @Param('userId') userId: string,
    @Param('actionCode') actionCode: string,
  ) {
    const hasPermission = await this.rbacService.checkUserPermission(userId, actionCode);
    return { hasPermission, actionCode, userId };
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get RBAC statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved' })
  async getRbacStatistics() {
    return this.rbacService.getRbacStatistics();
  }
}