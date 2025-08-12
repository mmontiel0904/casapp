import gql from 'graphql-tag';
import * as VueApolloComposable from '@vue/apollo-composable';
import * as VueCompositionApi from 'vue';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type ReactiveFunction<TParam> = () => TParam;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * Implement the DateTime<Utc> scalar
   *
   * The input/output is a string in RFC3339 format.
   */
  DateTime: { input: any; output: any; }
  /**
   * A UUID is a unique 128-bit number, stored as 16 octets. UUIDs are parsed as
   * Strings within GraphQL. UUIDs are used to assign unique identifiers to
   * entities without requiring a central allocating authority.
   *
   * # References
   *
   * * [Wikipedia: Universally Unique Identifier](http://en.wikipedia.org/wiki/Universally_unique_identifier)
   * * [RFC4122: A Universally Unique Identifier (UUID) URN Namespace](http://tools.ietf.org/html/rfc4122)
   */
  UUID: { input: any; output: any; }
};

export type AcceptInvitationInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  invitationToken: Scalars['String']['input'];
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type Activity = {
  actionType: Scalars['String']['output'];
  actor?: Maybe<User>;
  actorId: Scalars['UUID']['output'];
  changesJson?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['UUID']['output'];
  entityType: Scalars['String']['output'];
  id: Scalars['UUID']['output'];
  metadataJson?: Maybe<Scalars['String']['output']>;
};

export type AddCommentInput = {
  content: Scalars['String']['input'];
  entityId: Scalars['UUID']['input'];
  entityType: EntityType;
  mentions?: InputMaybe<Array<Scalars['UUID']['input']>>;
};

export type AddProjectMemberInput = {
  projectId: Scalars['UUID']['input'];
  role: Scalars['String']['input'];
  userId: Scalars['UUID']['input'];
};

export type AdminResetUserPasswordInput = {
  userId: Scalars['UUID']['input'];
};

export type AssignPermissionToRoleInput = {
  permissionId: Scalars['UUID']['input'];
  roleId: Scalars['UUID']['input'];
};

export type AssignRoleInput = {
  roleId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
};

export type AssignTaskInput = {
  assigneeId?: InputMaybe<Scalars['UUID']['input']>;
  taskId: Scalars['UUID']['input'];
};

export type AuthPayload = {
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type ChangePasswordInput = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
};

export type CreatePermissionInput = {
  action: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  resourceId: Scalars['UUID']['input'];
};

export type CreateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateResourceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type CreateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  level: Scalars['Int']['input'];
  name: Scalars['String']['input'];
};

export type CreateTaskInput = {
  assigneeId?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  name: Scalars['String']['input'];
  priority?: InputMaybe<TaskPriority>;
  projectId: Scalars['UUID']['input'];
  recurrenceDay?: InputMaybe<Scalars['Int']['input']>;
  recurrenceType?: InputMaybe<RecurrenceType>;
};

export enum EntityType {
  Project = 'PROJECT',
  Settings = 'SETTINGS',
  Task = 'TASK',
  User = 'USER'
}

export type GrantUserPermissionInput = {
  permissionId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
};

export type Invitation = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  inviterUserId: Scalars['UUID']['output'];
  isUsed: Scalars['Boolean']['output'];
  role?: Maybe<Role>;
  usedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type InviteUserInput = {
  email: Scalars['String']['input'];
};

export type InviteUserWithRoleInput = {
  email: Scalars['String']['input'];
  roleId?: InputMaybe<Scalars['UUID']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MessageResponse = {
  message: Scalars['String']['output'];
};

export type MutationRoot = {
  acceptInvitation: AuthPayload;
  addComment: Activity;
  addProjectMember: MessageResponse;
  adminResetUserPassword: MessageResponse;
  assignPermissionToRole: MessageResponse;
  assignRole: User;
  assignTask: Task;
  changePassword: MessageResponse;
  createPermission: Permission;
  createProject: Project;
  createResource: Resource;
  createRole: Role;
  createTask: Task;
  deletePermission: MessageResponse;
  deleteProject: MessageResponse;
  deleteResource: MessageResponse;
  deleteRole: MessageResponse;
  deleteTask: MessageResponse;
  grantUserPermission: MessageResponse;
  inviteUser: Invitation;
  inviteUserWithRole: Invitation;
  login: AuthPayload;
  logout: MessageResponse;
  refreshToken: AuthPayload;
  register: User;
  removePermissionFromRole: MessageResponse;
  removeProjectMember: MessageResponse;
  removeUserRole: User;
  requestPasswordReset: MessageResponse;
  resetPassword: MessageResponse;
  revokeUserPermission: MessageResponse;
  updateMemberRole: MessageResponse;
  updatePermission: Permission;
  updateProject: Project;
  updateResource: Resource;
  updateRole: Role;
  updateTask: Task;
  verifyEmail: MessageResponse;
};


export type MutationRootAcceptInvitationArgs = {
  input: AcceptInvitationInput;
};


export type MutationRootAddCommentArgs = {
  input: AddCommentInput;
};


export type MutationRootAddProjectMemberArgs = {
  input: AddProjectMemberInput;
};


export type MutationRootAdminResetUserPasswordArgs = {
  input: AdminResetUserPasswordInput;
};


export type MutationRootAssignPermissionToRoleArgs = {
  input: AssignPermissionToRoleInput;
};


export type MutationRootAssignRoleArgs = {
  input: AssignRoleInput;
};


export type MutationRootAssignTaskArgs = {
  input: AssignTaskInput;
};


export type MutationRootChangePasswordArgs = {
  input: ChangePasswordInput;
};


export type MutationRootCreatePermissionArgs = {
  input: CreatePermissionInput;
};


export type MutationRootCreateProjectArgs = {
  input: CreateProjectInput;
};


export type MutationRootCreateResourceArgs = {
  input: CreateResourceInput;
};


export type MutationRootCreateRoleArgs = {
  input: CreateRoleInput;
};


export type MutationRootCreateTaskArgs = {
  input: CreateTaskInput;
};


export type MutationRootDeletePermissionArgs = {
  permissionId: Scalars['UUID']['input'];
};


export type MutationRootDeleteProjectArgs = {
  projectId: Scalars['UUID']['input'];
};


export type MutationRootDeleteResourceArgs = {
  resourceId: Scalars['UUID']['input'];
};


export type MutationRootDeleteRoleArgs = {
  roleId: Scalars['UUID']['input'];
};


export type MutationRootDeleteTaskArgs = {
  taskId: Scalars['UUID']['input'];
};


export type MutationRootGrantUserPermissionArgs = {
  input: GrantUserPermissionInput;
};


export type MutationRootInviteUserArgs = {
  input: InviteUserInput;
};


export type MutationRootInviteUserWithRoleArgs = {
  input: InviteUserWithRoleInput;
};


export type MutationRootLoginArgs = {
  input: LoginInput;
};


export type MutationRootRefreshTokenArgs = {
  input: RefreshTokenInput;
};


export type MutationRootRegisterArgs = {
  input: RegisterInput;
};


export type MutationRootRemovePermissionFromRoleArgs = {
  input: RemovePermissionFromRoleInput;
};


export type MutationRootRemoveProjectMemberArgs = {
  input: RemoveProjectMemberInput;
};


export type MutationRootRemoveUserRoleArgs = {
  userId: Scalars['UUID']['input'];
};


export type MutationRootRequestPasswordResetArgs = {
  input: RequestPasswordResetInput;
};


export type MutationRootResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationRootRevokeUserPermissionArgs = {
  input: RevokeUserPermissionInput;
};


export type MutationRootUpdateMemberRoleArgs = {
  input: UpdateMemberRoleInput;
};


export type MutationRootUpdatePermissionArgs = {
  input: UpdatePermissionInput;
};


export type MutationRootUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationRootUpdateResourceArgs = {
  input: UpdateResourceInput;
};


export type MutationRootUpdateRoleArgs = {
  input: UpdateRoleInput;
};


export type MutationRootUpdateTaskArgs = {
  input: UpdateTaskInput;
};


export type MutationRootVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type Permission = {
  action: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isActive: Scalars['Boolean']['output'];
  resource?: Maybe<Resource>;
  resourceId: Scalars['UUID']['output'];
  resourceName: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type Project = {
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isActive: Scalars['Boolean']['output'];
  members: Array<ProjectMember>;
  name: Scalars['String']['output'];
  owner?: Maybe<User>;
  ownerId: Scalars['UUID']['output'];
  tasks: Array<Task>;
  updatedAt: Scalars['DateTime']['output'];
};


export type ProjectTasksArgs = {
  assigneeId?: InputMaybe<Scalars['UUID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<TaskStatus>;
};

export type ProjectMember = {
  id: Scalars['UUID']['output'];
  joinedAt: Scalars['DateTime']['output'];
  projectId: Scalars['UUID']['output'];
  role: Scalars['String']['output'];
  user: User;
  userId: Scalars['UUID']['output'];
};

export type QueryRoot = {
  activities: Array<Activity>;
  allPermissions: Array<Permission>;
  allResources: Array<Resource>;
  allRoles: Array<Role>;
  allRolesWithPermissions: Array<RoleWithPermissions>;
  allUsers: Array<UserWithRole>;
  health: Scalars['String']['output'];
  me: User;
  myAssignedTasks: Array<Task>;
  myInvitations: Array<Invitation>;
  myProjects: Array<Project>;
  permissionById?: Maybe<Permission>;
  project?: Maybe<Project>;
  projectTaskStats: TaskStats;
  projectTasks: Array<Task>;
  resourceById?: Maybe<Resource>;
  roleById?: Maybe<RoleWithPermissions>;
  rolePermissions: Array<Permission>;
  task?: Maybe<Task>;
  userById: UserWithRole;
  userDirectPermissions: Array<Permission>;
  userPermissions: Array<Scalars['String']['output']>;
  usersByRole: Array<UserWithRole>;
};


export type QueryRootActivitiesArgs = {
  entityId: Scalars['UUID']['input'];
  entityType: EntityType;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRootAllPermissionsArgs = {
  resourceId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryRootMyAssignedTasksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<TaskStatus>;
};


export type QueryRootMyProjectsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryRootPermissionByIdArgs = {
  permissionId: Scalars['UUID']['input'];
};


export type QueryRootProjectArgs = {
  projectId: Scalars['UUID']['input'];
};


export type QueryRootProjectTaskStatsArgs = {
  projectId: Scalars['UUID']['input'];
};


export type QueryRootProjectTasksArgs = {
  assigneeId?: InputMaybe<Scalars['UUID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  projectId: Scalars['UUID']['input'];
  status?: InputMaybe<TaskStatus>;
};


export type QueryRootResourceByIdArgs = {
  resourceId: Scalars['UUID']['input'];
};


export type QueryRootRoleByIdArgs = {
  roleId: Scalars['UUID']['input'];
};


export type QueryRootRolePermissionsArgs = {
  roleId: Scalars['UUID']['input'];
};


export type QueryRootTaskArgs = {
  taskId: Scalars['UUID']['input'];
};


export type QueryRootUserByIdArgs = {
  userId: Scalars['UUID']['input'];
};


export type QueryRootUserDirectPermissionsArgs = {
  userId: Scalars['UUID']['input'];
};


export type QueryRootUserPermissionsArgs = {
  userId: Scalars['UUID']['input'];
};


export type QueryRootUsersByRoleArgs = {
  roleName: Scalars['String']['input'];
};

export enum RecurrenceType {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  None = 'NONE',
  Weekdays = 'WEEKDAYS',
  Weekly = 'WEEKLY'
}

export type RefreshTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type RemovePermissionFromRoleInput = {
  permissionId: Scalars['UUID']['input'];
  roleId: Scalars['UUID']['input'];
};

export type RemoveProjectMemberInput = {
  projectId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
};

export type RequestPasswordResetInput = {
  email: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type Resource = {
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isActive: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RevokeUserPermissionInput = {
  permissionId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
};

export type Role = {
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isActive: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RoleWithPermissions = {
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isActive: Scalars['Boolean']['output'];
  level: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  permissions: Array<Permission>;
  updatedAt: Scalars['DateTime']['output'];
  userCount: Scalars['Int']['output'];
};

export type Task = {
  activities: Array<Activity>;
  activityCount: Scalars['Int']['output'];
  assignee?: Maybe<User>;
  assigneeId?: Maybe<Scalars['UUID']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<User>;
  creatorId: Scalars['UUID']['output'];
  description?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['UUID']['output'];
  isRecurring: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  nextDueDate?: Maybe<Scalars['DateTime']['output']>;
  parentTask?: Maybe<Task>;
  parentTaskId?: Maybe<Scalars['UUID']['output']>;
  priority: TaskPriority;
  project?: Maybe<Project>;
  projectId: Scalars['UUID']['output'];
  recurrenceDay?: Maybe<Scalars['Int']['output']>;
  recurrenceType: RecurrenceType;
  recurringInstances: Array<Task>;
  status: TaskStatus;
  updatedAt: Scalars['DateTime']['output'];
};


export type TaskActivitiesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type TaskRecurringInstancesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
};

export enum TaskPriority {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
  Urgent = 'URGENT'
}

export type TaskStats = {
  cancelled: Scalars['Int']['output'];
  completed: Scalars['Int']['output'];
  inProgress: Scalars['Int']['output'];
  overdue: Scalars['Int']['output'];
  todo: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export enum TaskStatus {
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Todo = 'TODO'
}

export type UpdateMemberRoleInput = {
  projectId: Scalars['UUID']['input'];
  role: Scalars['String']['input'];
  userId: Scalars['UUID']['input'];
};

export type UpdatePermissionInput = {
  action?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  permissionId: Scalars['UUID']['input'];
  resourceId?: InputMaybe<Scalars['UUID']['input']>;
};

export type UpdateProjectInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['UUID']['input'];
};

export type UpdateResourceInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  resourceId: Scalars['UUID']['input'];
};

export type UpdateRoleInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  level?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  roleId: Scalars['UUID']['input'];
};

export type UpdateTaskInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['DateTime']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<TaskPriority>;
  recurrenceDay?: InputMaybe<Scalars['Int']['input']>;
  recurrenceType?: InputMaybe<RecurrenceType>;
  status?: InputMaybe<TaskStatus>;
  taskId: Scalars['UUID']['input'];
};

export type User = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  permissions: Array<Scalars['String']['output']>;
  role?: Maybe<Role>;
  updatedAt: Scalars['DateTime']['output'];
};

export type UserWithRole = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  permissions: Array<Scalars['String']['output']>;
  role?: Maybe<Role>;
  updatedAt: Scalars['DateTime']['output'];
};

export type TaskActivitiesQueryVariables = Exact<{
  taskId: Scalars['UUID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaskActivitiesQuery = { task?: { id: any, name: string, activityCount: number, activities: Array<{ id: any, actionType: string, description?: string | null, entityId: any, entityType: string, actorId: any, changesJson?: string | null, metadataJson?: string | null, createdAt: any, actor?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null }> } | null };

export type TaskActivityCountQueryVariables = Exact<{
  taskId: Scalars['UUID']['input'];
}>;


export type TaskActivityCountQuery = { task?: { id: any, activityCount: number } | null };

export type TaskWithActivitiesQueryVariables = Exact<{
  taskId: Scalars['UUID']['input'];
  activityLimit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaskWithActivitiesQuery = { task?: { id: any, name: string, description?: string | null, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, isRecurring: boolean, recurrenceType: RecurrenceType, recurrenceDay?: number | null, nextDueDate?: any | null, createdAt: any, updatedAt: any, activityCount: number, assignee?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, creator?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, project?: { id: any, name: string, description?: string | null } | null, parentTask?: { id: any, name: string, status: TaskStatus } | null, activities: Array<{ id: any, actionType: string, description?: string | null, entityId: any, entityType: string, actorId: any, changesJson?: string | null, metadataJson?: string | null, createdAt: any, actor?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null }>, recurringInstances: Array<{ id: any, name: string, status: TaskStatus, dueDate?: any | null, nextDueDate?: any | null }> } | null };

export type AddCommentMutationVariables = Exact<{
  input: AddCommentInput;
}>;


export type AddCommentMutation = { addComment: { id: any, actionType: string, description?: string | null, entityId: any, entityType: string, actorId: any, changesJson?: string | null, metadataJson?: string | null, createdAt: any, actor?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null } };

export type GetActivitiesQueryVariables = Exact<{
  entityId: Scalars['UUID']['input'];
  entityType: EntityType;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetActivitiesQuery = { activities: Array<{ id: any, actionType: string, description?: string | null, entityId: any, entityType: string, actorId: any, changesJson?: string | null, metadataJson?: string | null, createdAt: any, actor?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null }> };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { login: { accessToken: string, refreshToken: string, user: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, role?: { id: any, name: string, level: number, description?: string | null } | null } } };

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
}>;


export type RegisterMutation = { register: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, createdAt: any, updatedAt: any } };

export type InviteUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type InviteUserMutation = { inviteUser: { id: any, email: string, inviterUserId: any, isUsed: boolean, createdAt: any, expiresAt: any } };

export type AcceptInvitationMutationVariables = Exact<{
  input: AcceptInvitationInput;
}>;


export type AcceptInvitationMutation = { acceptInvitation: { accessToken: string, refreshToken: string, user: { id: any, email: string, firstName?: string | null, lastName?: string | null } } };

export type RequestPasswordResetMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestPasswordResetMutation = { requestPasswordReset: { message: string } };

export type ResetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ResetPasswordMutation = { resetPassword: { message: string } };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;


export type VerifyEmailMutation = { verifyEmail: { message: string } };

export type RefreshTokenMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;


export type RefreshTokenMutation = { refreshToken: { accessToken: string, refreshToken: string, user: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean } } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout: { message: string } };

export type ChangePasswordMutationVariables = Exact<{
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;


export type ChangePasswordMutation = { changePassword: { message: string } };

export type AdminResetUserPasswordMutationVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type AdminResetUserPasswordMutation = { adminResetUserPassword: { message: string } };

export type AssignRoleMutationVariables = Exact<{
  userId: Scalars['UUID']['input'];
  roleId: Scalars['UUID']['input'];
}>;


export type AssignRoleMutation = { assignRole: { id: any, email: string, firstName?: string | null, lastName?: string | null, role?: { id: any, name: string, level: number, description?: string | null } | null } };

export type RemoveUserRoleMutationVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type RemoveUserRoleMutation = { removeUserRole: { id: any, email: string, firstName?: string | null, lastName?: string | null, role?: { id: any, name: string, level: number } | null } };

export type InviteUserWithRoleMutationVariables = Exact<{
  email: Scalars['String']['input'];
  roleId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type InviteUserWithRoleMutation = { inviteUserWithRole: { id: any, email: string, inviterUserId: any, isUsed: boolean, createdAt: any, expiresAt: any, role?: { id: any, name: string, level: number, description?: string | null } | null } };

export type MyProjectsQueryVariables = Exact<{
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyProjectsQuery = { myProjects: Array<{ id: any, name: string, description?: string | null, ownerId: any, isActive: boolean, createdAt: any, updatedAt: any, owner?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ id: any, role: string, joinedAt: any, user: { id: any, email: string, firstName?: string | null, lastName?: string | null } }> }> };

export type ProjectQueryVariables = Exact<{
  projectId: Scalars['UUID']['input'];
}>;


export type ProjectQuery = { project?: { id: any, name: string, description?: string | null, ownerId: any, isActive: boolean, createdAt: any, updatedAt: any, owner?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, members: Array<{ id: any, role: string, joinedAt: any, user: { id: any, email: string, firstName?: string | null, lastName?: string | null } }>, tasks: Array<{ id: any, name: string, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, assignee?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null }> } | null };

export type CreateProjectMutationVariables = Exact<{
  input: CreateProjectInput;
}>;


export type CreateProjectMutation = { createProject: { id: any, name: string, description?: string | null, ownerId: any, createdAt: any } };

export type UpdateProjectMutationVariables = Exact<{
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { updateProject: { id: any, name: string, description?: string | null, updatedAt: any } };

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars['UUID']['input'];
}>;


export type DeleteProjectMutation = { deleteProject: { message: string } };

export type ProjectTasksQueryVariables = Exact<{
  projectId: Scalars['UUID']['input'];
  status?: InputMaybe<TaskStatus>;
  assigneeId?: InputMaybe<Scalars['UUID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ProjectTasksQuery = { projectTasks: Array<{ id: any, name: string, description?: string | null, projectId: any, assigneeId?: any | null, creatorId: any, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, isRecurring: boolean, recurrenceType: RecurrenceType, recurrenceDay?: number | null, nextDueDate?: any | null, parentTaskId?: any | null, activityCount: number, createdAt: any, updatedAt: any, assignee?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, creator?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, parentTask?: { id: any, name: string, status: TaskStatus } | null }> };

export type MyAssignedTasksQueryVariables = Exact<{
  status?: InputMaybe<TaskStatus>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type MyAssignedTasksQuery = { myAssignedTasks: Array<{ id: any, name: string, description?: string | null, projectId: any, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, isRecurring: boolean, recurrenceType: RecurrenceType, recurrenceDay?: number | null, nextDueDate?: any | null, parentTaskId?: any | null, activityCount: number, createdAt: any, updatedAt: any, project?: { id: any, name: string } | null, creator?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, parentTask?: { id: any, name: string, status: TaskStatus } | null }> };

export type ProjectTaskStatsQueryVariables = Exact<{
  projectId: Scalars['UUID']['input'];
}>;


export type ProjectTaskStatsQuery = { projectTaskStats: { total: number, todo: number, inProgress: number, completed: number, cancelled: number, overdue: number } };

export type CreateTaskMutationVariables = Exact<{
  input: CreateTaskInput;
}>;


export type CreateTaskMutation = { createTask: { id: any, name: string, description?: string | null, projectId: any, assigneeId?: any | null, creatorId: any, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, isRecurring: boolean, recurrenceType: RecurrenceType, recurrenceDay?: number | null, nextDueDate?: any | null, parentTaskId?: any | null, createdAt: any, assignee?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, parentTask?: { id: any, name: string, status: TaskStatus } | null } };

export type UpdateTaskMutationVariables = Exact<{
  input: UpdateTaskInput;
}>;


export type UpdateTaskMutation = { updateTask: { id: any, name: string, description?: string | null, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, isRecurring: boolean, recurrenceType: RecurrenceType, recurrenceDay?: number | null, nextDueDate?: any | null, updatedAt: any } };

export type AssignTaskMutationVariables = Exact<{
  input: AssignTaskInput;
}>;


export type AssignTaskMutation = { assignTask: { id: any, assigneeId?: any | null, updatedAt: any, assignee?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null } };

export type DeleteTaskMutationVariables = Exact<{
  taskId: Scalars['UUID']['input'];
}>;


export type DeleteTaskMutation = { deleteTask: { message: string } };

export type AddProjectMemberMutationVariables = Exact<{
  input: AddProjectMemberInput;
}>;


export type AddProjectMemberMutation = { addProjectMember: { message: string } };

export type UpdateMemberRoleMutationVariables = Exact<{
  input: UpdateMemberRoleInput;
}>;


export type UpdateMemberRoleMutation = { updateMemberRole: { message: string } };

export type RemoveProjectMemberMutationVariables = Exact<{
  input: RemoveProjectMemberInput;
}>;


export type RemoveProjectMemberMutation = { removeProjectMember: { message: string } };

export type TaskRecurringInstancesQueryVariables = Exact<{
  taskId: Scalars['UUID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type TaskRecurringInstancesQuery = { task?: { id: any, name: string, isRecurring: boolean, recurrenceType: RecurrenceType, recurrenceDay?: number | null, nextDueDate?: any | null, recurringInstances: Array<{ id: any, name: string, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, nextDueDate?: any | null, createdAt: any, assignee?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null }> } | null };

export type TaskWithParentQueryVariables = Exact<{
  taskId: Scalars['UUID']['input'];
}>;


export type TaskWithParentQuery = { task?: { id: any, name: string, description?: string | null, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, isRecurring: boolean, recurrenceType: RecurrenceType, recurrenceDay?: number | null, nextDueDate?: any | null, parentTaskId?: any | null, createdAt: any, updatedAt: any, assignee?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, creator?: { id: any, email: string, firstName?: string | null, lastName?: string | null } | null, project?: { id: any, name: string } | null, parentTask?: { id: any, name: string, status: TaskStatus, priority: TaskPriority, dueDate?: any | null, isRecurring: boolean, recurrenceType: RecurrenceType, recurrenceDay?: number | null } | null } | null };

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { health: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, createdAt: any, updatedAt: any, role?: { id: any, name: string, level: number, description?: string | null } | null } };

export type MyPermissionsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type MyPermissionsQuery = { userPermissions: Array<string> };

export type MeWithPermissionsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type MeWithPermissionsQuery = { userPermissions: Array<string>, me: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, createdAt: any, updatedAt: any, role?: { id: any, name: string, level: number, description?: string | null } | null } };

export type AllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type AllUsersQuery = { allUsers: Array<{ id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, permissions: Array<string>, createdAt: any, updatedAt: any, role?: { id: any, name: string, level: number, description?: string | null } | null }> };

export type AllRolesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllRolesQuery = { allRoles: Array<{ id: any, name: string, level: number, description?: string | null, isActive: boolean, createdAt: any, updatedAt: any }> };

export type UserPermissionsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type UserPermissionsQuery = { userPermissions: Array<string> };

export type UserByIdQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type UserByIdQuery = { userById: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, permissions: Array<string>, createdAt: any, updatedAt: any, role?: { id: any, name: string, level: number, description?: string | null } | null } };

export type UsersByRoleQueryVariables = Exact<{
  roleName: Scalars['String']['input'];
}>;


export type UsersByRoleQuery = { usersByRole: Array<{ id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, permissions: Array<string>, createdAt: any, updatedAt: any, role?: { id: any, name: string, level: number, description?: string | null } | null }> };

export type AllRolesWithPermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type AllRolesWithPermissionsQuery = { allRolesWithPermissions: Array<{ id: any, name: string, level: number, description?: string | null, isActive: boolean, userCount: number, createdAt: any, updatedAt: any, permissions: Array<{ id: any, action: string, description?: string | null, resourceName: string, resourceId: any, isActive: boolean }> }> };

export type AllPermissionsQueryVariables = Exact<{
  resourceId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type AllPermissionsQuery = { allPermissions: Array<{ id: any, action: string, description?: string | null, resourceName: string, resourceId: any, isActive: boolean, createdAt: any, updatedAt: any, resource?: { id: any, name: string, description?: string | null } | null }> };

export type AllResourcesQueryVariables = Exact<{ [key: string]: never; }>;


export type AllResourcesQuery = { allResources: Array<{ id: any, name: string, description?: string | null, isActive: boolean, createdAt: any, updatedAt: any }> };

export type CreateRoleMutationVariables = Exact<{
  input: CreateRoleInput;
}>;


export type CreateRoleMutation = { createRole: { id: any, name: string, level: number, description?: string | null, isActive: boolean, createdAt: any, updatedAt: any } };

export type UpdateRoleMutationVariables = Exact<{
  input: UpdateRoleInput;
}>;


export type UpdateRoleMutation = { updateRole: { id: any, name: string, level: number, description?: string | null, isActive: boolean, createdAt: any, updatedAt: any } };

export type DeleteRoleMutationVariables = Exact<{
  roleId: Scalars['UUID']['input'];
}>;


export type DeleteRoleMutation = { deleteRole: { message: string } };

export type CreatePermissionMutationVariables = Exact<{
  input: CreatePermissionInput;
}>;


export type CreatePermissionMutation = { createPermission: { id: any, action: string, description?: string | null, resourceName: string, resourceId: any, isActive: boolean, createdAt: any, updatedAt: any, resource?: { id: any, name: string, description?: string | null } | null } };

export type UpdatePermissionMutationVariables = Exact<{
  input: UpdatePermissionInput;
}>;


export type UpdatePermissionMutation = { updatePermission: { id: any, action: string, description?: string | null, resourceName: string, resourceId: any, isActive: boolean, createdAt: any, updatedAt: any, resource?: { id: any, name: string, description?: string | null } | null } };

export type DeletePermissionMutationVariables = Exact<{
  permissionId: Scalars['UUID']['input'];
}>;


export type DeletePermissionMutation = { deletePermission: { message: string } };

export type CreateResourceMutationVariables = Exact<{
  input: CreateResourceInput;
}>;


export type CreateResourceMutation = { createResource: { id: any, name: string, description?: string | null, isActive: boolean, createdAt: any, updatedAt: any } };

export type UpdateResourceMutationVariables = Exact<{
  input: UpdateResourceInput;
}>;


export type UpdateResourceMutation = { updateResource: { id: any, name: string, description?: string | null, isActive: boolean, createdAt: any, updatedAt: any } };

export type DeleteResourceMutationVariables = Exact<{
  resourceId: Scalars['UUID']['input'];
}>;


export type DeleteResourceMutation = { deleteResource: { message: string } };

export type AssignPermissionToRoleMutationVariables = Exact<{
  input: AssignPermissionToRoleInput;
}>;


export type AssignPermissionToRoleMutation = { assignPermissionToRole: { message: string } };

export type RemovePermissionFromRoleMutationVariables = Exact<{
  input: RemovePermissionFromRoleInput;
}>;


export type RemovePermissionFromRoleMutation = { removePermissionFromRole: { message: string } };

export type GrantUserPermissionMutationVariables = Exact<{
  input: GrantUserPermissionInput;
}>;


export type GrantUserPermissionMutation = { grantUserPermission: { message: string } };

export type RevokeUserPermissionMutationVariables = Exact<{
  input: RevokeUserPermissionInput;
}>;


export type RevokeUserPermissionMutation = { revokeUserPermission: { message: string } };

export type FastLoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type FastLoginMutation = { login: { accessToken: string, refreshToken: string, user: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, createdAt: any, updatedAt: any } } };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { me: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, createdAt: any, updatedAt: any, role?: { id: any, name: string, level: number, description?: string | null, isActive: boolean, createdAt: any, updatedAt: any } | null } };

export type GetUserPermissionsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type GetUserPermissionsQuery = { userPermissions: Array<string> };


export const TaskActivitiesDocument = gql`
    query TaskActivities($taskId: UUID!, $limit: Int, $offset: Int) {
  task(taskId: $taskId) {
    id
    name
    activityCount
    activities(limit: $limit, offset: $offset) {
      id
      actionType
      description
      entityId
      entityType
      actorId
      changesJson
      metadataJson
      createdAt
      actor {
        id
        email
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useTaskActivitiesQuery__
 *
 * To run a query within a Vue component, call `useTaskActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskActivitiesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useTaskActivitiesQuery({
 *   taskId: // value for 'taskId'
 *   limit: // value for 'limit'
 *   offset: // value for 'offset'
 * });
 */
export function useTaskActivitiesQuery(variables: TaskActivitiesQueryVariables | VueCompositionApi.Ref<TaskActivitiesQueryVariables> | ReactiveFunction<TaskActivitiesQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskActivitiesQuery, TaskActivitiesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskActivitiesQuery, TaskActivitiesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskActivitiesQuery, TaskActivitiesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<TaskActivitiesQuery, TaskActivitiesQueryVariables>(TaskActivitiesDocument, variables, options);
}
export function useTaskActivitiesLazyQuery(variables?: TaskActivitiesQueryVariables | VueCompositionApi.Ref<TaskActivitiesQueryVariables> | ReactiveFunction<TaskActivitiesQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskActivitiesQuery, TaskActivitiesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskActivitiesQuery, TaskActivitiesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskActivitiesQuery, TaskActivitiesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<TaskActivitiesQuery, TaskActivitiesQueryVariables>(TaskActivitiesDocument, variables, options);
}
export type TaskActivitiesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<TaskActivitiesQuery, TaskActivitiesQueryVariables>;
export const TaskActivityCountDocument = gql`
    query TaskActivityCount($taskId: UUID!) {
  task(taskId: $taskId) {
    id
    activityCount
  }
}
    `;

/**
 * __useTaskActivityCountQuery__
 *
 * To run a query within a Vue component, call `useTaskActivityCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskActivityCountQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useTaskActivityCountQuery({
 *   taskId: // value for 'taskId'
 * });
 */
export function useTaskActivityCountQuery(variables: TaskActivityCountQueryVariables | VueCompositionApi.Ref<TaskActivityCountQueryVariables> | ReactiveFunction<TaskActivityCountQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskActivityCountQuery, TaskActivityCountQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskActivityCountQuery, TaskActivityCountQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskActivityCountQuery, TaskActivityCountQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<TaskActivityCountQuery, TaskActivityCountQueryVariables>(TaskActivityCountDocument, variables, options);
}
export function useTaskActivityCountLazyQuery(variables?: TaskActivityCountQueryVariables | VueCompositionApi.Ref<TaskActivityCountQueryVariables> | ReactiveFunction<TaskActivityCountQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskActivityCountQuery, TaskActivityCountQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskActivityCountQuery, TaskActivityCountQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskActivityCountQuery, TaskActivityCountQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<TaskActivityCountQuery, TaskActivityCountQueryVariables>(TaskActivityCountDocument, variables, options);
}
export type TaskActivityCountQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<TaskActivityCountQuery, TaskActivityCountQueryVariables>;
export const TaskWithActivitiesDocument = gql`
    query TaskWithActivities($taskId: UUID!, $activityLimit: Int = 10) {
  task(taskId: $taskId) {
    id
    name
    description
    status
    priority
    dueDate
    isRecurring
    recurrenceType
    recurrenceDay
    nextDueDate
    createdAt
    updatedAt
    activityCount
    assignee {
      id
      email
      firstName
      lastName
    }
    creator {
      id
      email
      firstName
      lastName
    }
    project {
      id
      name
      description
    }
    parentTask {
      id
      name
      status
    }
    activities(limit: $activityLimit) {
      id
      actionType
      description
      entityId
      entityType
      actorId
      changesJson
      metadataJson
      createdAt
      actor {
        id
        email
        firstName
        lastName
      }
    }
    recurringInstances(limit: 5) {
      id
      name
      status
      dueDate
      nextDueDate
    }
  }
}
    `;

/**
 * __useTaskWithActivitiesQuery__
 *
 * To run a query within a Vue component, call `useTaskWithActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskWithActivitiesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useTaskWithActivitiesQuery({
 *   taskId: // value for 'taskId'
 *   activityLimit: // value for 'activityLimit'
 * });
 */
export function useTaskWithActivitiesQuery(variables: TaskWithActivitiesQueryVariables | VueCompositionApi.Ref<TaskWithActivitiesQueryVariables> | ReactiveFunction<TaskWithActivitiesQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables>(TaskWithActivitiesDocument, variables, options);
}
export function useTaskWithActivitiesLazyQuery(variables?: TaskWithActivitiesQueryVariables | VueCompositionApi.Ref<TaskWithActivitiesQueryVariables> | ReactiveFunction<TaskWithActivitiesQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables>(TaskWithActivitiesDocument, variables, options);
}
export type TaskWithActivitiesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<TaskWithActivitiesQuery, TaskWithActivitiesQueryVariables>;
export const AddCommentDocument = gql`
    mutation AddComment($input: AddCommentInput!) {
  addComment(input: $input) {
    id
    actionType
    description
    entityId
    entityType
    actorId
    changesJson
    metadataJson
    createdAt
    actor {
      id
      email
      firstName
      lastName
    }
  }
}
    `;

/**
 * __useAddCommentMutation__
 *
 * To run a mutation, you first call `useAddCommentMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAddCommentMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAddCommentMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useAddCommentMutation(options: VueApolloComposable.UseMutationOptions<AddCommentMutation, AddCommentMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddCommentMutation, AddCommentMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AddCommentMutation, AddCommentMutationVariables>(AddCommentDocument, options);
}
export type AddCommentMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddCommentMutation, AddCommentMutationVariables>;
export const GetActivitiesDocument = gql`
    query GetActivities($entityId: UUID!, $entityType: EntityType!, $limit: Int, $offset: Int) {
  activities(
    entityId: $entityId
    entityType: $entityType
    limit: $limit
    offset: $offset
  ) {
    id
    actionType
    description
    entityId
    entityType
    actorId
    changesJson
    metadataJson
    createdAt
    actor {
      id
      email
      firstName
      lastName
    }
  }
}
    `;

/**
 * __useGetActivitiesQuery__
 *
 * To run a query within a Vue component, call `useGetActivitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActivitiesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetActivitiesQuery({
 *   entityId: // value for 'entityId'
 *   entityType: // value for 'entityType'
 *   limit: // value for 'limit'
 *   offset: // value for 'offset'
 * });
 */
export function useGetActivitiesQuery(variables: GetActivitiesQueryVariables | VueCompositionApi.Ref<GetActivitiesQueryVariables> | ReactiveFunction<GetActivitiesQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetActivitiesQuery, GetActivitiesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetActivitiesQuery, GetActivitiesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetActivitiesQuery, GetActivitiesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetActivitiesQuery, GetActivitiesQueryVariables>(GetActivitiesDocument, variables, options);
}
export function useGetActivitiesLazyQuery(variables?: GetActivitiesQueryVariables | VueCompositionApi.Ref<GetActivitiesQueryVariables> | ReactiveFunction<GetActivitiesQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetActivitiesQuery, GetActivitiesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetActivitiesQuery, GetActivitiesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetActivitiesQuery, GetActivitiesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetActivitiesQuery, GetActivitiesQueryVariables>(GetActivitiesDocument, variables, options);
}
export type GetActivitiesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetActivitiesQuery, GetActivitiesQueryVariables>;
export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(input: {email: $email, password: $password}) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
      isEmailVerified
      role {
        id
        name
        level
        description
      }
    }
  }
}
    `;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLoginMutation({
 *   variables: {
 *     email: // value for 'email'
 *     password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(options: VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LoginMutation, LoginMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
}
export type LoginMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LoginMutation, LoginMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $firstName: String, $lastName: String) {
  register(
    input: {email: $email, password: $password, firstName: $firstName, lastName: $lastName}
  ) {
    id
    email
    firstName
    lastName
    isEmailVerified
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRegisterMutation({
 *   variables: {
 *     email: // value for 'email'
 *     password: // value for 'password'
 *     firstName: // value for 'firstName'
 *     lastName: // value for 'lastName'
 *   },
 * });
 */
export function useRegisterMutation(options: VueApolloComposable.UseMutationOptions<RegisterMutation, RegisterMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RegisterMutation, RegisterMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
}
export type RegisterMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RegisterMutation, RegisterMutationVariables>;
export const InviteUserDocument = gql`
    mutation InviteUser($email: String!) {
  inviteUser(input: {email: $email}) {
    id
    email
    inviterUserId
    isUsed
    createdAt
    expiresAt
  }
}
    `;

/**
 * __useInviteUserMutation__
 *
 * To run a mutation, you first call `useInviteUserMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useInviteUserMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useInviteUserMutation({
 *   variables: {
 *     email: // value for 'email'
 *   },
 * });
 */
export function useInviteUserMutation(options: VueApolloComposable.UseMutationOptions<InviteUserMutation, InviteUserMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<InviteUserMutation, InviteUserMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<InviteUserMutation, InviteUserMutationVariables>(InviteUserDocument, options);
}
export type InviteUserMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<InviteUserMutation, InviteUserMutationVariables>;
export const AcceptInvitationDocument = gql`
    mutation AcceptInvitation($input: AcceptInvitationInput!) {
  acceptInvitation(input: $input) {
    user {
      id
      email
      firstName
      lastName
    }
    accessToken
    refreshToken
  }
}
    `;

/**
 * __useAcceptInvitationMutation__
 *
 * To run a mutation, you first call `useAcceptInvitationMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAcceptInvitationMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAcceptInvitationMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useAcceptInvitationMutation(options: VueApolloComposable.UseMutationOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AcceptInvitationMutation, AcceptInvitationMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AcceptInvitationMutation, AcceptInvitationMutationVariables>(AcceptInvitationDocument, options);
}
export type AcceptInvitationMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AcceptInvitationMutation, AcceptInvitationMutationVariables>;
export const RequestPasswordResetDocument = gql`
    mutation RequestPasswordReset($email: String!) {
  requestPasswordReset(input: {email: $email}) {
    message
  }
}
    `;

/**
 * __useRequestPasswordResetMutation__
 *
 * To run a mutation, you first call `useRequestPasswordResetMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRequestPasswordResetMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRequestPasswordResetMutation({
 *   variables: {
 *     email: // value for 'email'
 *   },
 * });
 */
export function useRequestPasswordResetMutation(options: VueApolloComposable.UseMutationOptions<RequestPasswordResetMutation, RequestPasswordResetMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>(RequestPasswordResetDocument, options);
}
export type RequestPasswordResetMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RequestPasswordResetMutation, RequestPasswordResetMutationVariables>;
export const ResetPasswordDocument = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
  resetPassword(input: {token: $token, newPassword: $newPassword}) {
    message
  }
}
    `;

/**
 * __useResetPasswordMutation__
 *
 * To run a mutation, you first call `useResetPasswordMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useResetPasswordMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useResetPasswordMutation({
 *   variables: {
 *     token: // value for 'token'
 *     newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useResetPasswordMutation(options: VueApolloComposable.UseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ResetPasswordMutation, ResetPasswordMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<ResetPasswordMutation, ResetPasswordMutationVariables>(ResetPasswordDocument, options);
}
export type ResetPasswordMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ResetPasswordMutation, ResetPasswordMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    message
  }
}
    `;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useVerifyEmailMutation({
 *   variables: {
 *     token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(options: VueApolloComposable.UseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
}
export type VerifyEmailMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const RefreshTokenDocument = gql`
    mutation RefreshToken($refreshToken: String!) {
  refreshToken(input: {refreshToken: $refreshToken}) {
    accessToken
    refreshToken
    user {
      id
      email
      firstName
      lastName
      isEmailVerified
    }
  }
}
    `;

/**
 * __useRefreshTokenMutation__
 *
 * To run a mutation, you first call `useRefreshTokenMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRefreshTokenMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRefreshTokenMutation({
 *   variables: {
 *     refreshToken: // value for 'refreshToken'
 *   },
 * });
 */
export function useRefreshTokenMutation(options: VueApolloComposable.UseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RefreshTokenMutation, RefreshTokenMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RefreshTokenMutation, RefreshTokenMutationVariables>(RefreshTokenDocument, options);
}
export type RefreshTokenMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RefreshTokenMutation, RefreshTokenMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    message
  }
}
    `;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useLogoutMutation();
 */
export function useLogoutMutation(options: VueApolloComposable.UseMutationOptions<LogoutMutation, LogoutMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<LogoutMutation, LogoutMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
}
export type LogoutMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<LogoutMutation, LogoutMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
  changePassword(
    input: {currentPassword: $currentPassword, newPassword: $newPassword}
  ) {
    message
  }
}
    `;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useChangePasswordMutation({
 *   variables: {
 *     currentPassword: // value for 'currentPassword'
 *     newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(options: VueApolloComposable.UseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
}
export type ChangePasswordMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const AdminResetUserPasswordDocument = gql`
    mutation AdminResetUserPassword($userId: UUID!) {
  adminResetUserPassword(input: {userId: $userId}) {
    message
  }
}
    `;

/**
 * __useAdminResetUserPasswordMutation__
 *
 * To run a mutation, you first call `useAdminResetUserPasswordMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAdminResetUserPasswordMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAdminResetUserPasswordMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *   },
 * });
 */
export function useAdminResetUserPasswordMutation(options: VueApolloComposable.UseMutationOptions<AdminResetUserPasswordMutation, AdminResetUserPasswordMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AdminResetUserPasswordMutation, AdminResetUserPasswordMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AdminResetUserPasswordMutation, AdminResetUserPasswordMutationVariables>(AdminResetUserPasswordDocument, options);
}
export type AdminResetUserPasswordMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AdminResetUserPasswordMutation, AdminResetUserPasswordMutationVariables>;
export const AssignRoleDocument = gql`
    mutation AssignRole($userId: UUID!, $roleId: UUID!) {
  assignRole(input: {userId: $userId, roleId: $roleId}) {
    id
    email
    firstName
    lastName
    role {
      id
      name
      level
      description
    }
  }
}
    `;

/**
 * __useAssignRoleMutation__
 *
 * To run a mutation, you first call `useAssignRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAssignRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAssignRoleMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *     roleId: // value for 'roleId'
 *   },
 * });
 */
export function useAssignRoleMutation(options: VueApolloComposable.UseMutationOptions<AssignRoleMutation, AssignRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AssignRoleMutation, AssignRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AssignRoleMutation, AssignRoleMutationVariables>(AssignRoleDocument, options);
}
export type AssignRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AssignRoleMutation, AssignRoleMutationVariables>;
export const RemoveUserRoleDocument = gql`
    mutation RemoveUserRole($userId: UUID!) {
  removeUserRole(userId: $userId) {
    id
    email
    firstName
    lastName
    role {
      id
      name
      level
    }
  }
}
    `;

/**
 * __useRemoveUserRoleMutation__
 *
 * To run a mutation, you first call `useRemoveUserRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRemoveUserRoleMutation({
 *   variables: {
 *     userId: // value for 'userId'
 *   },
 * });
 */
export function useRemoveUserRoleMutation(options: VueApolloComposable.UseMutationOptions<RemoveUserRoleMutation, RemoveUserRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemoveUserRoleMutation, RemoveUserRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RemoveUserRoleMutation, RemoveUserRoleMutationVariables>(RemoveUserRoleDocument, options);
}
export type RemoveUserRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemoveUserRoleMutation, RemoveUserRoleMutationVariables>;
export const InviteUserWithRoleDocument = gql`
    mutation InviteUserWithRole($email: String!, $roleId: UUID) {
  inviteUserWithRole(input: {email: $email, roleId: $roleId}) {
    id
    email
    inviterUserId
    isUsed
    createdAt
    expiresAt
    role {
      id
      name
      level
      description
    }
  }
}
    `;

/**
 * __useInviteUserWithRoleMutation__
 *
 * To run a mutation, you first call `useInviteUserWithRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useInviteUserWithRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useInviteUserWithRoleMutation({
 *   variables: {
 *     email: // value for 'email'
 *     roleId: // value for 'roleId'
 *   },
 * });
 */
export function useInviteUserWithRoleMutation(options: VueApolloComposable.UseMutationOptions<InviteUserWithRoleMutation, InviteUserWithRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<InviteUserWithRoleMutation, InviteUserWithRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<InviteUserWithRoleMutation, InviteUserWithRoleMutationVariables>(InviteUserWithRoleDocument, options);
}
export type InviteUserWithRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<InviteUserWithRoleMutation, InviteUserWithRoleMutationVariables>;
export const MyProjectsDocument = gql`
    query MyProjects($limit: Int, $offset: Int) {
  myProjects(limit: $limit, offset: $offset) {
    id
    name
    description
    ownerId
    isActive
    createdAt
    updatedAt
    owner {
      id
      email
      firstName
      lastName
    }
    members {
      id
      role
      joinedAt
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useMyProjectsQuery__
 *
 * To run a query within a Vue component, call `useMyProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyProjectsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMyProjectsQuery({
 *   limit: // value for 'limit'
 *   offset: // value for 'offset'
 * });
 */
export function useMyProjectsQuery(variables: MyProjectsQueryVariables | VueCompositionApi.Ref<MyProjectsQueryVariables> | ReactiveFunction<MyProjectsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<MyProjectsQuery, MyProjectsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MyProjectsQuery, MyProjectsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MyProjectsQuery, MyProjectsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<MyProjectsQuery, MyProjectsQueryVariables>(MyProjectsDocument, variables, options);
}
export function useMyProjectsLazyQuery(variables: MyProjectsQueryVariables | VueCompositionApi.Ref<MyProjectsQueryVariables> | ReactiveFunction<MyProjectsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<MyProjectsQuery, MyProjectsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MyProjectsQuery, MyProjectsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MyProjectsQuery, MyProjectsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<MyProjectsQuery, MyProjectsQueryVariables>(MyProjectsDocument, variables, options);
}
export type MyProjectsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MyProjectsQuery, MyProjectsQueryVariables>;
export const ProjectDocument = gql`
    query Project($projectId: UUID!) {
  project(projectId: $projectId) {
    id
    name
    description
    ownerId
    isActive
    createdAt
    updatedAt
    owner {
      id
      email
      firstName
      lastName
    }
    members {
      id
      role
      joinedAt
      user {
        id
        email
        firstName
        lastName
      }
    }
    tasks(limit: 10) {
      id
      name
      status
      priority
      dueDate
      assignee {
        id
        email
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useProjectQuery__
 *
 * To run a query within a Vue component, call `useProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useProjectQuery({
 *   projectId: // value for 'projectId'
 * });
 */
export function useProjectQuery(variables: ProjectQueryVariables | VueCompositionApi.Ref<ProjectQueryVariables> | ReactiveFunction<ProjectQueryVariables>, options: VueApolloComposable.UseQueryOptions<ProjectQuery, ProjectQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ProjectQuery, ProjectQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ProjectQuery, ProjectQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, variables, options);
}
export function useProjectLazyQuery(variables?: ProjectQueryVariables | VueCompositionApi.Ref<ProjectQueryVariables> | ReactiveFunction<ProjectQueryVariables>, options: VueApolloComposable.UseQueryOptions<ProjectQuery, ProjectQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ProjectQuery, ProjectQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ProjectQuery, ProjectQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<ProjectQuery, ProjectQueryVariables>(ProjectDocument, variables, options);
}
export type ProjectQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<ProjectQuery, ProjectQueryVariables>;
export const CreateProjectDocument = gql`
    mutation CreateProject($input: CreateProjectInput!) {
  createProject(input: $input) {
    id
    name
    description
    ownerId
    createdAt
  }
}
    `;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateProjectMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useCreateProjectMutation(options: VueApolloComposable.UseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, options);
}
export type CreateProjectMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateProjectMutation, CreateProjectMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation UpdateProject($input: UpdateProjectInput!) {
  updateProject(input: $input) {
    id
    name
    description
    updatedAt
  }
}
    `;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateProjectMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProjectMutation(options: VueApolloComposable.UseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, options);
}
export type UpdateProjectMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation DeleteProject($projectId: UUID!) {
  deleteProject(projectId: $projectId) {
    message
  }
}
    `;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteProjectMutation({
 *   variables: {
 *     projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDeleteProjectMutation(options: VueApolloComposable.UseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, options);
}
export type DeleteProjectMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const ProjectTasksDocument = gql`
    query ProjectTasks($projectId: UUID!, $status: TaskStatus, $assigneeId: UUID, $limit: Int, $offset: Int) {
  projectTasks(
    projectId: $projectId
    status: $status
    assigneeId: $assigneeId
    limit: $limit
    offset: $offset
  ) {
    id
    name
    description
    projectId
    assigneeId
    creatorId
    status
    priority
    dueDate
    isRecurring
    recurrenceType
    recurrenceDay
    nextDueDate
    parentTaskId
    activityCount
    createdAt
    updatedAt
    assignee {
      id
      email
      firstName
      lastName
    }
    creator {
      id
      email
      firstName
      lastName
    }
    parentTask {
      id
      name
      status
    }
  }
}
    `;

/**
 * __useProjectTasksQuery__
 *
 * To run a query within a Vue component, call `useProjectTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectTasksQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useProjectTasksQuery({
 *   projectId: // value for 'projectId'
 *   status: // value for 'status'
 *   assigneeId: // value for 'assigneeId'
 *   limit: // value for 'limit'
 *   offset: // value for 'offset'
 * });
 */
export function useProjectTasksQuery(variables: ProjectTasksQueryVariables | VueCompositionApi.Ref<ProjectTasksQueryVariables> | ReactiveFunction<ProjectTasksQueryVariables>, options: VueApolloComposable.UseQueryOptions<ProjectTasksQuery, ProjectTasksQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ProjectTasksQuery, ProjectTasksQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ProjectTasksQuery, ProjectTasksQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<ProjectTasksQuery, ProjectTasksQueryVariables>(ProjectTasksDocument, variables, options);
}
export function useProjectTasksLazyQuery(variables?: ProjectTasksQueryVariables | VueCompositionApi.Ref<ProjectTasksQueryVariables> | ReactiveFunction<ProjectTasksQueryVariables>, options: VueApolloComposable.UseQueryOptions<ProjectTasksQuery, ProjectTasksQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ProjectTasksQuery, ProjectTasksQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ProjectTasksQuery, ProjectTasksQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<ProjectTasksQuery, ProjectTasksQueryVariables>(ProjectTasksDocument, variables, options);
}
export type ProjectTasksQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<ProjectTasksQuery, ProjectTasksQueryVariables>;
export const MyAssignedTasksDocument = gql`
    query MyAssignedTasks($status: TaskStatus, $limit: Int, $offset: Int) {
  myAssignedTasks(status: $status, limit: $limit, offset: $offset) {
    id
    name
    description
    projectId
    status
    priority
    dueDate
    isRecurring
    recurrenceType
    recurrenceDay
    nextDueDate
    parentTaskId
    activityCount
    createdAt
    updatedAt
    project {
      id
      name
    }
    creator {
      id
      email
      firstName
      lastName
    }
    parentTask {
      id
      name
      status
    }
  }
}
    `;

/**
 * __useMyAssignedTasksQuery__
 *
 * To run a query within a Vue component, call `useMyAssignedTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyAssignedTasksQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMyAssignedTasksQuery({
 *   status: // value for 'status'
 *   limit: // value for 'limit'
 *   offset: // value for 'offset'
 * });
 */
export function useMyAssignedTasksQuery(variables: MyAssignedTasksQueryVariables | VueCompositionApi.Ref<MyAssignedTasksQueryVariables> | ReactiveFunction<MyAssignedTasksQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<MyAssignedTasksQuery, MyAssignedTasksQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MyAssignedTasksQuery, MyAssignedTasksQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MyAssignedTasksQuery, MyAssignedTasksQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<MyAssignedTasksQuery, MyAssignedTasksQueryVariables>(MyAssignedTasksDocument, variables, options);
}
export function useMyAssignedTasksLazyQuery(variables: MyAssignedTasksQueryVariables | VueCompositionApi.Ref<MyAssignedTasksQueryVariables> | ReactiveFunction<MyAssignedTasksQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<MyAssignedTasksQuery, MyAssignedTasksQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MyAssignedTasksQuery, MyAssignedTasksQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MyAssignedTasksQuery, MyAssignedTasksQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<MyAssignedTasksQuery, MyAssignedTasksQueryVariables>(MyAssignedTasksDocument, variables, options);
}
export type MyAssignedTasksQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MyAssignedTasksQuery, MyAssignedTasksQueryVariables>;
export const ProjectTaskStatsDocument = gql`
    query ProjectTaskStats($projectId: UUID!) {
  projectTaskStats(projectId: $projectId) {
    total
    todo
    inProgress
    completed
    cancelled
    overdue
  }
}
    `;

/**
 * __useProjectTaskStatsQuery__
 *
 * To run a query within a Vue component, call `useProjectTaskStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProjectTaskStatsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useProjectTaskStatsQuery({
 *   projectId: // value for 'projectId'
 * });
 */
export function useProjectTaskStatsQuery(variables: ProjectTaskStatsQueryVariables | VueCompositionApi.Ref<ProjectTaskStatsQueryVariables> | ReactiveFunction<ProjectTaskStatsQueryVariables>, options: VueApolloComposable.UseQueryOptions<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables>(ProjectTaskStatsDocument, variables, options);
}
export function useProjectTaskStatsLazyQuery(variables?: ProjectTaskStatsQueryVariables | VueCompositionApi.Ref<ProjectTaskStatsQueryVariables> | ReactiveFunction<ProjectTaskStatsQueryVariables>, options: VueApolloComposable.UseQueryOptions<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables>(ProjectTaskStatsDocument, variables, options);
}
export type ProjectTaskStatsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<ProjectTaskStatsQuery, ProjectTaskStatsQueryVariables>;
export const CreateTaskDocument = gql`
    mutation CreateTask($input: CreateTaskInput!) {
  createTask(input: $input) {
    id
    name
    description
    projectId
    assigneeId
    creatorId
    status
    priority
    dueDate
    isRecurring
    recurrenceType
    recurrenceDay
    nextDueDate
    parentTaskId
    createdAt
    assignee {
      id
      email
      firstName
      lastName
    }
    parentTask {
      id
      name
      status
    }
  }
}
    `;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateTaskMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useCreateTaskMutation(options: VueApolloComposable.UseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, options);
}
export type CreateTaskMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($input: UpdateTaskInput!) {
  updateTask(input: $input) {
    id
    name
    description
    status
    priority
    dueDate
    isRecurring
    recurrenceType
    recurrenceDay
    nextDueDate
    updatedAt
  }
}
    `;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateTaskMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTaskMutation(options: VueApolloComposable.UseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, options);
}
export type UpdateTaskMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const AssignTaskDocument = gql`
    mutation AssignTask($input: AssignTaskInput!) {
  assignTask(input: $input) {
    id
    assigneeId
    assignee {
      id
      email
      firstName
      lastName
    }
    updatedAt
  }
}
    `;

/**
 * __useAssignTaskMutation__
 *
 * To run a mutation, you first call `useAssignTaskMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAssignTaskMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAssignTaskMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useAssignTaskMutation(options: VueApolloComposable.UseMutationOptions<AssignTaskMutation, AssignTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AssignTaskMutation, AssignTaskMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AssignTaskMutation, AssignTaskMutationVariables>(AssignTaskDocument, options);
}
export type AssignTaskMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AssignTaskMutation, AssignTaskMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation DeleteTask($taskId: UUID!) {
  deleteTask(taskId: $taskId) {
    message
  }
}
    `;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteTaskMutation({
 *   variables: {
 *     taskId: // value for 'taskId'
 *   },
 * });
 */
export function useDeleteTaskMutation(options: VueApolloComposable.UseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, options);
}
export type DeleteTaskMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteTaskMutation, DeleteTaskMutationVariables>;
export const AddProjectMemberDocument = gql`
    mutation AddProjectMember($input: AddProjectMemberInput!) {
  addProjectMember(input: $input) {
    message
  }
}
    `;

/**
 * __useAddProjectMemberMutation__
 *
 * To run a mutation, you first call `useAddProjectMemberMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAddProjectMemberMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAddProjectMemberMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useAddProjectMemberMutation(options: VueApolloComposable.UseMutationOptions<AddProjectMemberMutation, AddProjectMemberMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AddProjectMemberMutation, AddProjectMemberMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AddProjectMemberMutation, AddProjectMemberMutationVariables>(AddProjectMemberDocument, options);
}
export type AddProjectMemberMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AddProjectMemberMutation, AddProjectMemberMutationVariables>;
export const UpdateMemberRoleDocument = gql`
    mutation UpdateMemberRole($input: UpdateMemberRoleInput!) {
  updateMemberRole(input: $input) {
    message
  }
}
    `;

/**
 * __useUpdateMemberRoleMutation__
 *
 * To run a mutation, you first call `useUpdateMemberRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMemberRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateMemberRoleMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useUpdateMemberRoleMutation(options: VueApolloComposable.UseMutationOptions<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables>(UpdateMemberRoleDocument, options);
}
export type UpdateMemberRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateMemberRoleMutation, UpdateMemberRoleMutationVariables>;
export const RemoveProjectMemberDocument = gql`
    mutation RemoveProjectMember($input: RemoveProjectMemberInput!) {
  removeProjectMember(input: $input) {
    message
  }
}
    `;

/**
 * __useRemoveProjectMemberMutation__
 *
 * To run a mutation, you first call `useRemoveProjectMemberMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProjectMemberMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRemoveProjectMemberMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useRemoveProjectMemberMutation(options: VueApolloComposable.UseMutationOptions<RemoveProjectMemberMutation, RemoveProjectMemberMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemoveProjectMemberMutation, RemoveProjectMemberMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RemoveProjectMemberMutation, RemoveProjectMemberMutationVariables>(RemoveProjectMemberDocument, options);
}
export type RemoveProjectMemberMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemoveProjectMemberMutation, RemoveProjectMemberMutationVariables>;
export const TaskRecurringInstancesDocument = gql`
    query TaskRecurringInstances($taskId: UUID!, $limit: Int = 10) {
  task(taskId: $taskId) {
    id
    name
    isRecurring
    recurrenceType
    recurrenceDay
    nextDueDate
    recurringInstances(limit: $limit) {
      id
      name
      status
      priority
      dueDate
      nextDueDate
      createdAt
      assignee {
        id
        email
        firstName
        lastName
      }
    }
  }
}
    `;

/**
 * __useTaskRecurringInstancesQuery__
 *
 * To run a query within a Vue component, call `useTaskRecurringInstancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskRecurringInstancesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useTaskRecurringInstancesQuery({
 *   taskId: // value for 'taskId'
 *   limit: // value for 'limit'
 * });
 */
export function useTaskRecurringInstancesQuery(variables: TaskRecurringInstancesQueryVariables | VueCompositionApi.Ref<TaskRecurringInstancesQueryVariables> | ReactiveFunction<TaskRecurringInstancesQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables>(TaskRecurringInstancesDocument, variables, options);
}
export function useTaskRecurringInstancesLazyQuery(variables?: TaskRecurringInstancesQueryVariables | VueCompositionApi.Ref<TaskRecurringInstancesQueryVariables> | ReactiveFunction<TaskRecurringInstancesQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables>(TaskRecurringInstancesDocument, variables, options);
}
export type TaskRecurringInstancesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<TaskRecurringInstancesQuery, TaskRecurringInstancesQueryVariables>;
export const TaskWithParentDocument = gql`
    query TaskWithParent($taskId: UUID!) {
  task(taskId: $taskId) {
    id
    name
    description
    status
    priority
    dueDate
    isRecurring
    recurrenceType
    recurrenceDay
    nextDueDate
    parentTaskId
    createdAt
    updatedAt
    assignee {
      id
      email
      firstName
      lastName
    }
    creator {
      id
      email
      firstName
      lastName
    }
    project {
      id
      name
    }
    parentTask {
      id
      name
      status
      priority
      dueDate
      isRecurring
      recurrenceType
      recurrenceDay
    }
  }
}
    `;

/**
 * __useTaskWithParentQuery__
 *
 * To run a query within a Vue component, call `useTaskWithParentQuery` and pass it any options that fit your needs.
 * When your component renders, `useTaskWithParentQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useTaskWithParentQuery({
 *   taskId: // value for 'taskId'
 * });
 */
export function useTaskWithParentQuery(variables: TaskWithParentQueryVariables | VueCompositionApi.Ref<TaskWithParentQueryVariables> | ReactiveFunction<TaskWithParentQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskWithParentQuery, TaskWithParentQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskWithParentQuery, TaskWithParentQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskWithParentQuery, TaskWithParentQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<TaskWithParentQuery, TaskWithParentQueryVariables>(TaskWithParentDocument, variables, options);
}
export function useTaskWithParentLazyQuery(variables?: TaskWithParentQueryVariables | VueCompositionApi.Ref<TaskWithParentQueryVariables> | ReactiveFunction<TaskWithParentQueryVariables>, options: VueApolloComposable.UseQueryOptions<TaskWithParentQuery, TaskWithParentQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<TaskWithParentQuery, TaskWithParentQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<TaskWithParentQuery, TaskWithParentQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<TaskWithParentQuery, TaskWithParentQueryVariables>(TaskWithParentDocument, variables, options);
}
export type TaskWithParentQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<TaskWithParentQuery, TaskWithParentQueryVariables>;
export const HealthDocument = gql`
    query Health {
  health
}
    `;

/**
 * __useHealthQuery__
 *
 * To run a query within a Vue component, call `useHealthQuery` and pass it any options that fit your needs.
 * When your component renders, `useHealthQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useHealthQuery();
 */
export function useHealthQuery(options: VueApolloComposable.UseQueryOptions<HealthQuery, HealthQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<HealthQuery, HealthQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<HealthQuery, HealthQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<HealthQuery, HealthQueryVariables>(HealthDocument, {}, options);
}
export function useHealthLazyQuery(options: VueApolloComposable.UseQueryOptions<HealthQuery, HealthQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<HealthQuery, HealthQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<HealthQuery, HealthQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<HealthQuery, HealthQueryVariables>(HealthDocument, {}, options);
}
export type HealthQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<HealthQuery, HealthQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    firstName
    lastName
    isEmailVerified
    role {
      id
      name
      level
      description
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a Vue component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMeQuery();
 */
export function useMeQuery(options: VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<MeQuery, MeQueryVariables>(MeDocument, {}, options);
}
export function useMeLazyQuery(options: VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MeQuery, MeQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, {}, options);
}
export type MeQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MeQuery, MeQueryVariables>;
export const MyPermissionsDocument = gql`
    query MyPermissions($userId: UUID!) {
  userPermissions(userId: $userId)
}
    `;

/**
 * __useMyPermissionsQuery__
 *
 * To run a query within a Vue component, call `useMyPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMyPermissionsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMyPermissionsQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useMyPermissionsQuery(variables: MyPermissionsQueryVariables | VueCompositionApi.Ref<MyPermissionsQueryVariables> | ReactiveFunction<MyPermissionsQueryVariables>, options: VueApolloComposable.UseQueryOptions<MyPermissionsQuery, MyPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MyPermissionsQuery, MyPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MyPermissionsQuery, MyPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<MyPermissionsQuery, MyPermissionsQueryVariables>(MyPermissionsDocument, variables, options);
}
export function useMyPermissionsLazyQuery(variables?: MyPermissionsQueryVariables | VueCompositionApi.Ref<MyPermissionsQueryVariables> | ReactiveFunction<MyPermissionsQueryVariables>, options: VueApolloComposable.UseQueryOptions<MyPermissionsQuery, MyPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MyPermissionsQuery, MyPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MyPermissionsQuery, MyPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<MyPermissionsQuery, MyPermissionsQueryVariables>(MyPermissionsDocument, variables, options);
}
export type MyPermissionsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MyPermissionsQuery, MyPermissionsQueryVariables>;
export const MeWithPermissionsDocument = gql`
    query MeWithPermissions($userId: UUID!) {
  me {
    id
    email
    firstName
    lastName
    isEmailVerified
    role {
      id
      name
      level
      description
    }
    createdAt
    updatedAt
  }
  userPermissions(userId: $userId)
}
    `;

/**
 * __useMeWithPermissionsQuery__
 *
 * To run a query within a Vue component, call `useMeWithPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeWithPermissionsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useMeWithPermissionsQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useMeWithPermissionsQuery(variables: MeWithPermissionsQueryVariables | VueCompositionApi.Ref<MeWithPermissionsQueryVariables> | ReactiveFunction<MeWithPermissionsQueryVariables>, options: VueApolloComposable.UseQueryOptions<MeWithPermissionsQuery, MeWithPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MeWithPermissionsQuery, MeWithPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MeWithPermissionsQuery, MeWithPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<MeWithPermissionsQuery, MeWithPermissionsQueryVariables>(MeWithPermissionsDocument, variables, options);
}
export function useMeWithPermissionsLazyQuery(variables?: MeWithPermissionsQueryVariables | VueCompositionApi.Ref<MeWithPermissionsQueryVariables> | ReactiveFunction<MeWithPermissionsQueryVariables>, options: VueApolloComposable.UseQueryOptions<MeWithPermissionsQuery, MeWithPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<MeWithPermissionsQuery, MeWithPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<MeWithPermissionsQuery, MeWithPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<MeWithPermissionsQuery, MeWithPermissionsQueryVariables>(MeWithPermissionsDocument, variables, options);
}
export type MeWithPermissionsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<MeWithPermissionsQuery, MeWithPermissionsQueryVariables>;
export const AllUsersDocument = gql`
    query AllUsers {
  allUsers {
    id
    email
    firstName
    lastName
    isEmailVerified
    role {
      id
      name
      level
      description
    }
    permissions
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAllUsersQuery__
 *
 * To run a query within a Vue component, call `useAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllUsersQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useAllUsersQuery();
 */
export function useAllUsersQuery(options: VueApolloComposable.UseQueryOptions<AllUsersQuery, AllUsersQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllUsersQuery, AllUsersQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllUsersQuery, AllUsersQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, {}, options);
}
export function useAllUsersLazyQuery(options: VueApolloComposable.UseQueryOptions<AllUsersQuery, AllUsersQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllUsersQuery, AllUsersQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllUsersQuery, AllUsersQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<AllUsersQuery, AllUsersQueryVariables>(AllUsersDocument, {}, options);
}
export type AllUsersQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<AllUsersQuery, AllUsersQueryVariables>;
export const AllRolesDocument = gql`
    query AllRoles {
  allRoles {
    id
    name
    level
    description
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAllRolesQuery__
 *
 * To run a query within a Vue component, call `useAllRolesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllRolesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useAllRolesQuery();
 */
export function useAllRolesQuery(options: VueApolloComposable.UseQueryOptions<AllRolesQuery, AllRolesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllRolesQuery, AllRolesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllRolesQuery, AllRolesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<AllRolesQuery, AllRolesQueryVariables>(AllRolesDocument, {}, options);
}
export function useAllRolesLazyQuery(options: VueApolloComposable.UseQueryOptions<AllRolesQuery, AllRolesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllRolesQuery, AllRolesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllRolesQuery, AllRolesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<AllRolesQuery, AllRolesQueryVariables>(AllRolesDocument, {}, options);
}
export type AllRolesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<AllRolesQuery, AllRolesQueryVariables>;
export const UserPermissionsDocument = gql`
    query UserPermissions($userId: UUID!) {
  userPermissions(userId: $userId)
}
    `;

/**
 * __useUserPermissionsQuery__
 *
 * To run a query within a Vue component, call `useUserPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserPermissionsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useUserPermissionsQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useUserPermissionsQuery(variables: UserPermissionsQueryVariables | VueCompositionApi.Ref<UserPermissionsQueryVariables> | ReactiveFunction<UserPermissionsQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserPermissionsQuery, UserPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserPermissionsQuery, UserPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserPermissionsQuery, UserPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<UserPermissionsQuery, UserPermissionsQueryVariables>(UserPermissionsDocument, variables, options);
}
export function useUserPermissionsLazyQuery(variables?: UserPermissionsQueryVariables | VueCompositionApi.Ref<UserPermissionsQueryVariables> | ReactiveFunction<UserPermissionsQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserPermissionsQuery, UserPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserPermissionsQuery, UserPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserPermissionsQuery, UserPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<UserPermissionsQuery, UserPermissionsQueryVariables>(UserPermissionsDocument, variables, options);
}
export type UserPermissionsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<UserPermissionsQuery, UserPermissionsQueryVariables>;
export const UserByIdDocument = gql`
    query UserById($userId: UUID!) {
  userById(userId: $userId) {
    id
    email
    firstName
    lastName
    isEmailVerified
    role {
      id
      name
      level
      description
    }
    permissions
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUserByIdQuery__
 *
 * To run a query within a Vue component, call `useUserByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserByIdQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useUserByIdQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useUserByIdQuery(variables: UserByIdQueryVariables | VueCompositionApi.Ref<UserByIdQueryVariables> | ReactiveFunction<UserByIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserByIdQuery, UserByIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserByIdQuery, UserByIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserByIdQuery, UserByIdQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<UserByIdQuery, UserByIdQueryVariables>(UserByIdDocument, variables, options);
}
export function useUserByIdLazyQuery(variables?: UserByIdQueryVariables | VueCompositionApi.Ref<UserByIdQueryVariables> | ReactiveFunction<UserByIdQueryVariables>, options: VueApolloComposable.UseQueryOptions<UserByIdQuery, UserByIdQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UserByIdQuery, UserByIdQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UserByIdQuery, UserByIdQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<UserByIdQuery, UserByIdQueryVariables>(UserByIdDocument, variables, options);
}
export type UserByIdQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<UserByIdQuery, UserByIdQueryVariables>;
export const UsersByRoleDocument = gql`
    query UsersByRole($roleName: String!) {
  usersByRole(roleName: $roleName) {
    id
    email
    firstName
    lastName
    isEmailVerified
    role {
      id
      name
      level
      description
    }
    permissions
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUsersByRoleQuery__
 *
 * To run a query within a Vue component, call `useUsersByRoleQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersByRoleQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useUsersByRoleQuery({
 *   roleName: // value for 'roleName'
 * });
 */
export function useUsersByRoleQuery(variables: UsersByRoleQueryVariables | VueCompositionApi.Ref<UsersByRoleQueryVariables> | ReactiveFunction<UsersByRoleQueryVariables>, options: VueApolloComposable.UseQueryOptions<UsersByRoleQuery, UsersByRoleQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UsersByRoleQuery, UsersByRoleQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UsersByRoleQuery, UsersByRoleQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<UsersByRoleQuery, UsersByRoleQueryVariables>(UsersByRoleDocument, variables, options);
}
export function useUsersByRoleLazyQuery(variables?: UsersByRoleQueryVariables | VueCompositionApi.Ref<UsersByRoleQueryVariables> | ReactiveFunction<UsersByRoleQueryVariables>, options: VueApolloComposable.UseQueryOptions<UsersByRoleQuery, UsersByRoleQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<UsersByRoleQuery, UsersByRoleQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<UsersByRoleQuery, UsersByRoleQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<UsersByRoleQuery, UsersByRoleQueryVariables>(UsersByRoleDocument, variables, options);
}
export type UsersByRoleQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<UsersByRoleQuery, UsersByRoleQueryVariables>;
export const AllRolesWithPermissionsDocument = gql`
    query AllRolesWithPermissions {
  allRolesWithPermissions {
    id
    name
    level
    description
    isActive
    userCount
    permissions {
      id
      action
      description
      resourceName
      resourceId
      isActive
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAllRolesWithPermissionsQuery__
 *
 * To run a query within a Vue component, call `useAllRolesWithPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllRolesWithPermissionsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useAllRolesWithPermissionsQuery();
 */
export function useAllRolesWithPermissionsQuery(options: VueApolloComposable.UseQueryOptions<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables>(AllRolesWithPermissionsDocument, {}, options);
}
export function useAllRolesWithPermissionsLazyQuery(options: VueApolloComposable.UseQueryOptions<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables>(AllRolesWithPermissionsDocument, {}, options);
}
export type AllRolesWithPermissionsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<AllRolesWithPermissionsQuery, AllRolesWithPermissionsQueryVariables>;
export const AllPermissionsDocument = gql`
    query AllPermissions($resourceId: UUID) {
  allPermissions(resourceId: $resourceId) {
    id
    action
    description
    resourceName
    resourceId
    isActive
    resource {
      id
      name
      description
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAllPermissionsQuery__
 *
 * To run a query within a Vue component, call `useAllPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllPermissionsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useAllPermissionsQuery({
 *   resourceId: // value for 'resourceId'
 * });
 */
export function useAllPermissionsQuery(variables: AllPermissionsQueryVariables | VueCompositionApi.Ref<AllPermissionsQueryVariables> | ReactiveFunction<AllPermissionsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<AllPermissionsQuery, AllPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllPermissionsQuery, AllPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllPermissionsQuery, AllPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<AllPermissionsQuery, AllPermissionsQueryVariables>(AllPermissionsDocument, variables, options);
}
export function useAllPermissionsLazyQuery(variables: AllPermissionsQueryVariables | VueCompositionApi.Ref<AllPermissionsQueryVariables> | ReactiveFunction<AllPermissionsQueryVariables> = {}, options: VueApolloComposable.UseQueryOptions<AllPermissionsQuery, AllPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllPermissionsQuery, AllPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllPermissionsQuery, AllPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<AllPermissionsQuery, AllPermissionsQueryVariables>(AllPermissionsDocument, variables, options);
}
export type AllPermissionsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<AllPermissionsQuery, AllPermissionsQueryVariables>;
export const AllResourcesDocument = gql`
    query AllResources {
  allResources {
    id
    name
    description
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useAllResourcesQuery__
 *
 * To run a query within a Vue component, call `useAllResourcesQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllResourcesQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useAllResourcesQuery();
 */
export function useAllResourcesQuery(options: VueApolloComposable.UseQueryOptions<AllResourcesQuery, AllResourcesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllResourcesQuery, AllResourcesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllResourcesQuery, AllResourcesQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<AllResourcesQuery, AllResourcesQueryVariables>(AllResourcesDocument, {}, options);
}
export function useAllResourcesLazyQuery(options: VueApolloComposable.UseQueryOptions<AllResourcesQuery, AllResourcesQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<AllResourcesQuery, AllResourcesQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<AllResourcesQuery, AllResourcesQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<AllResourcesQuery, AllResourcesQueryVariables>(AllResourcesDocument, {}, options);
}
export type AllResourcesQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<AllResourcesQuery, AllResourcesQueryVariables>;
export const CreateRoleDocument = gql`
    mutation CreateRole($input: CreateRoleInput!) {
  createRole(input: $input) {
    id
    name
    level
    description
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCreateRoleMutation__
 *
 * To run a mutation, you first call `useCreateRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateRoleMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useCreateRoleMutation(options: VueApolloComposable.UseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateRoleMutation, CreateRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateRoleMutation, CreateRoleMutationVariables>(CreateRoleDocument, options);
}
export type CreateRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateRoleMutation, CreateRoleMutationVariables>;
export const UpdateRoleDocument = gql`
    mutation UpdateRole($input: UpdateRoleInput!) {
  updateRole(input: $input) {
    id
    name
    level
    description
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUpdateRoleMutation__
 *
 * To run a mutation, you first call `useUpdateRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateRoleMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useUpdateRoleMutation(options: VueApolloComposable.UseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateRoleMutation, UpdateRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateRoleMutation, UpdateRoleMutationVariables>(UpdateRoleDocument, options);
}
export type UpdateRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateRoleMutation, UpdateRoleMutationVariables>;
export const DeleteRoleDocument = gql`
    mutation DeleteRole($roleId: UUID!) {
  deleteRole(roleId: $roleId) {
    message
  }
}
    `;

/**
 * __useDeleteRoleMutation__
 *
 * To run a mutation, you first call `useDeleteRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteRoleMutation({
 *   variables: {
 *     roleId: // value for 'roleId'
 *   },
 * });
 */
export function useDeleteRoleMutation(options: VueApolloComposable.UseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteRoleMutation, DeleteRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteRoleMutation, DeleteRoleMutationVariables>(DeleteRoleDocument, options);
}
export type DeleteRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteRoleMutation, DeleteRoleMutationVariables>;
export const CreatePermissionDocument = gql`
    mutation CreatePermission($input: CreatePermissionInput!) {
  createPermission(input: $input) {
    id
    action
    description
    resourceName
    resourceId
    isActive
    resource {
      id
      name
      description
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCreatePermissionMutation__
 *
 * To run a mutation, you first call `useCreatePermissionMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreatePermissionMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreatePermissionMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useCreatePermissionMutation(options: VueApolloComposable.UseMutationOptions<CreatePermissionMutation, CreatePermissionMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreatePermissionMutation, CreatePermissionMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreatePermissionMutation, CreatePermissionMutationVariables>(CreatePermissionDocument, options);
}
export type CreatePermissionMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreatePermissionMutation, CreatePermissionMutationVariables>;
export const UpdatePermissionDocument = gql`
    mutation UpdatePermission($input: UpdatePermissionInput!) {
  updatePermission(input: $input) {
    id
    action
    description
    resourceName
    resourceId
    isActive
    resource {
      id
      name
      description
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUpdatePermissionMutation__
 *
 * To run a mutation, you first call `useUpdatePermissionMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePermissionMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdatePermissionMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useUpdatePermissionMutation(options: VueApolloComposable.UseMutationOptions<UpdatePermissionMutation, UpdatePermissionMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdatePermissionMutation, UpdatePermissionMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdatePermissionMutation, UpdatePermissionMutationVariables>(UpdatePermissionDocument, options);
}
export type UpdatePermissionMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdatePermissionMutation, UpdatePermissionMutationVariables>;
export const DeletePermissionDocument = gql`
    mutation DeletePermission($permissionId: UUID!) {
  deletePermission(permissionId: $permissionId) {
    message
  }
}
    `;

/**
 * __useDeletePermissionMutation__
 *
 * To run a mutation, you first call `useDeletePermissionMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeletePermissionMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeletePermissionMutation({
 *   variables: {
 *     permissionId: // value for 'permissionId'
 *   },
 * });
 */
export function useDeletePermissionMutation(options: VueApolloComposable.UseMutationOptions<DeletePermissionMutation, DeletePermissionMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeletePermissionMutation, DeletePermissionMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeletePermissionMutation, DeletePermissionMutationVariables>(DeletePermissionDocument, options);
}
export type DeletePermissionMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeletePermissionMutation, DeletePermissionMutationVariables>;
export const CreateResourceDocument = gql`
    mutation CreateResource($input: CreateResourceInput!) {
  createResource(input: $input) {
    id
    name
    description
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useCreateResourceMutation__
 *
 * To run a mutation, you first call `useCreateResourceMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useCreateResourceMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useCreateResourceMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useCreateResourceMutation(options: VueApolloComposable.UseMutationOptions<CreateResourceMutation, CreateResourceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<CreateResourceMutation, CreateResourceMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<CreateResourceMutation, CreateResourceMutationVariables>(CreateResourceDocument, options);
}
export type CreateResourceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<CreateResourceMutation, CreateResourceMutationVariables>;
export const UpdateResourceDocument = gql`
    mutation UpdateResource($input: UpdateResourceInput!) {
  updateResource(input: $input) {
    id
    name
    description
    isActive
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useUpdateResourceMutation__
 *
 * To run a mutation, you first call `useUpdateResourceMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useUpdateResourceMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useUpdateResourceMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useUpdateResourceMutation(options: VueApolloComposable.UseMutationOptions<UpdateResourceMutation, UpdateResourceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<UpdateResourceMutation, UpdateResourceMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<UpdateResourceMutation, UpdateResourceMutationVariables>(UpdateResourceDocument, options);
}
export type UpdateResourceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<UpdateResourceMutation, UpdateResourceMutationVariables>;
export const DeleteResourceDocument = gql`
    mutation DeleteResource($resourceId: UUID!) {
  deleteResource(resourceId: $resourceId) {
    message
  }
}
    `;

/**
 * __useDeleteResourceMutation__
 *
 * To run a mutation, you first call `useDeleteResourceMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useDeleteResourceMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useDeleteResourceMutation({
 *   variables: {
 *     resourceId: // value for 'resourceId'
 *   },
 * });
 */
export function useDeleteResourceMutation(options: VueApolloComposable.UseMutationOptions<DeleteResourceMutation, DeleteResourceMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<DeleteResourceMutation, DeleteResourceMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<DeleteResourceMutation, DeleteResourceMutationVariables>(DeleteResourceDocument, options);
}
export type DeleteResourceMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<DeleteResourceMutation, DeleteResourceMutationVariables>;
export const AssignPermissionToRoleDocument = gql`
    mutation AssignPermissionToRole($input: AssignPermissionToRoleInput!) {
  assignPermissionToRole(input: $input) {
    message
  }
}
    `;

/**
 * __useAssignPermissionToRoleMutation__
 *
 * To run a mutation, you first call `useAssignPermissionToRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useAssignPermissionToRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useAssignPermissionToRoleMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useAssignPermissionToRoleMutation(options: VueApolloComposable.UseMutationOptions<AssignPermissionToRoleMutation, AssignPermissionToRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<AssignPermissionToRoleMutation, AssignPermissionToRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<AssignPermissionToRoleMutation, AssignPermissionToRoleMutationVariables>(AssignPermissionToRoleDocument, options);
}
export type AssignPermissionToRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<AssignPermissionToRoleMutation, AssignPermissionToRoleMutationVariables>;
export const RemovePermissionFromRoleDocument = gql`
    mutation RemovePermissionFromRole($input: RemovePermissionFromRoleInput!) {
  removePermissionFromRole(input: $input) {
    message
  }
}
    `;

/**
 * __useRemovePermissionFromRoleMutation__
 *
 * To run a mutation, you first call `useRemovePermissionFromRoleMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRemovePermissionFromRoleMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRemovePermissionFromRoleMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useRemovePermissionFromRoleMutation(options: VueApolloComposable.UseMutationOptions<RemovePermissionFromRoleMutation, RemovePermissionFromRoleMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RemovePermissionFromRoleMutation, RemovePermissionFromRoleMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RemovePermissionFromRoleMutation, RemovePermissionFromRoleMutationVariables>(RemovePermissionFromRoleDocument, options);
}
export type RemovePermissionFromRoleMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RemovePermissionFromRoleMutation, RemovePermissionFromRoleMutationVariables>;
export const GrantUserPermissionDocument = gql`
    mutation GrantUserPermission($input: GrantUserPermissionInput!) {
  grantUserPermission(input: $input) {
    message
  }
}
    `;

/**
 * __useGrantUserPermissionMutation__
 *
 * To run a mutation, you first call `useGrantUserPermissionMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useGrantUserPermissionMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useGrantUserPermissionMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useGrantUserPermissionMutation(options: VueApolloComposable.UseMutationOptions<GrantUserPermissionMutation, GrantUserPermissionMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<GrantUserPermissionMutation, GrantUserPermissionMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<GrantUserPermissionMutation, GrantUserPermissionMutationVariables>(GrantUserPermissionDocument, options);
}
export type GrantUserPermissionMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<GrantUserPermissionMutation, GrantUserPermissionMutationVariables>;
export const RevokeUserPermissionDocument = gql`
    mutation RevokeUserPermission($input: RevokeUserPermissionInput!) {
  revokeUserPermission(input: $input) {
    message
  }
}
    `;

/**
 * __useRevokeUserPermissionMutation__
 *
 * To run a mutation, you first call `useRevokeUserPermissionMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useRevokeUserPermissionMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useRevokeUserPermissionMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useRevokeUserPermissionMutation(options: VueApolloComposable.UseMutationOptions<RevokeUserPermissionMutation, RevokeUserPermissionMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<RevokeUserPermissionMutation, RevokeUserPermissionMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<RevokeUserPermissionMutation, RevokeUserPermissionMutationVariables>(RevokeUserPermissionDocument, options);
}
export type RevokeUserPermissionMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<RevokeUserPermissionMutation, RevokeUserPermissionMutationVariables>;
export const FastLoginDocument = gql`
    mutation FastLogin($input: LoginInput!) {
  login(input: $input) {
    user {
      id
      email
      firstName
      lastName
      isEmailVerified
      createdAt
      updatedAt
    }
    accessToken
    refreshToken
  }
}
    `;

/**
 * __useFastLoginMutation__
 *
 * To run a mutation, you first call `useFastLoginMutation` within a Vue component and pass it any options that fit your needs.
 * When your component renders, `useFastLoginMutation` returns an object that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - Several other properties: https://v4.apollo.vuejs.org/api/use-mutation.html#return
 *
 * @param options that will be passed into the mutation, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/mutation.html#options;
 *
 * @example
 * const { mutate, loading, error, onDone } = useFastLoginMutation({
 *   variables: {
 *     input: // value for 'input'
 *   },
 * });
 */
export function useFastLoginMutation(options: VueApolloComposable.UseMutationOptions<FastLoginMutation, FastLoginMutationVariables> | ReactiveFunction<VueApolloComposable.UseMutationOptions<FastLoginMutation, FastLoginMutationVariables>> = {}) {
  return VueApolloComposable.useMutation<FastLoginMutation, FastLoginMutationVariables>(FastLoginDocument, options);
}
export type FastLoginMutationCompositionFunctionResult = VueApolloComposable.UseMutationReturn<FastLoginMutation, FastLoginMutationVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  me {
    id
    email
    firstName
    lastName
    isEmailVerified
    role {
      id
      name
      level
      description
      isActive
      createdAt
      updatedAt
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a Vue component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetCurrentUserQuery();
 */
export function useGetCurrentUserQuery(options: VueApolloComposable.UseQueryOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, {}, options);
}
export function useGetCurrentUserLazyQuery(options: VueApolloComposable.UseQueryOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, {}, options);
}
export type GetCurrentUserQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetUserPermissionsDocument = gql`
    query GetUserPermissions($userId: UUID!) {
  userPermissions(userId: $userId)
}
    `;

/**
 * __useGetUserPermissionsQuery__
 *
 * To run a query within a Vue component, call `useGetUserPermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPermissionsQuery` returns an object from Apollo Client that contains result, loading and error properties
 * you can use to render your UI.
 *
 * @param variables that will be passed into the query
 * @param options that will be passed into the query, supported options are listed on: https://v4.apollo.vuejs.org/guide-composable/query.html#options;
 *
 * @example
 * const { result, loading, error } = useGetUserPermissionsQuery({
 *   userId: // value for 'userId'
 * });
 */
export function useGetUserPermissionsQuery(variables: GetUserPermissionsQueryVariables | VueCompositionApi.Ref<GetUserPermissionsQueryVariables> | ReactiveFunction<GetUserPermissionsQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useQuery<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>(GetUserPermissionsDocument, variables, options);
}
export function useGetUserPermissionsLazyQuery(variables?: GetUserPermissionsQueryVariables | VueCompositionApi.Ref<GetUserPermissionsQueryVariables> | ReactiveFunction<GetUserPermissionsQueryVariables>, options: VueApolloComposable.UseQueryOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables> | VueCompositionApi.Ref<VueApolloComposable.UseQueryOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>> | ReactiveFunction<VueApolloComposable.UseQueryOptions<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>> = {}) {
  return VueApolloComposable.useLazyQuery<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>(GetUserPermissionsDocument, variables, options);
}
export type GetUserPermissionsQueryCompositionFunctionResult = VueApolloComposable.UseQueryReturn<GetUserPermissionsQuery, GetUserPermissionsQueryVariables>;