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

export type AdminResetUserPasswordInput = {
  userId: Scalars['UUID']['input'];
};

export type AssignRoleInput = {
  roleId: Scalars['UUID']['input'];
  userId: Scalars['UUID']['input'];
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
  adminResetUserPassword: MessageResponse;
  assignRole: User;
  changePassword: MessageResponse;
  inviteUser: Invitation;
  inviteUserWithRole: Invitation;
  login: AuthPayload;
  logout: MessageResponse;
  refreshToken: AuthPayload;
  register: User;
  removeUserRole: User;
  requestPasswordReset: MessageResponse;
  resetPassword: MessageResponse;
  verifyEmail: MessageResponse;
};


export type MutationRootAcceptInvitationArgs = {
  input: AcceptInvitationInput;
};


export type MutationRootAdminResetUserPasswordArgs = {
  input: AdminResetUserPasswordInput;
};


export type MutationRootAssignRoleArgs = {
  input: AssignRoleInput;
};


export type MutationRootChangePasswordArgs = {
  input: ChangePasswordInput;
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


export type MutationRootRemoveUserRoleArgs = {
  userId: Scalars['UUID']['input'];
};


export type MutationRootRequestPasswordResetArgs = {
  input: RequestPasswordResetInput;
};


export type MutationRootResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationRootVerifyEmailArgs = {
  token: Scalars['String']['input'];
};

export type QueryRoot = {
  allRoles: Array<Role>;
  allUsers: Array<UserWithRole>;
  health: Scalars['String']['output'];
  me: User;
  myInvitations: Array<Invitation>;
  userById: UserWithRole;
  userPermissions: Array<Scalars['String']['output']>;
  usersByRole: Array<UserWithRole>;
};


export type QueryRootUserByIdArgs = {
  userId: Scalars['UUID']['input'];
};


export type QueryRootUserPermissionsArgs = {
  userId: Scalars['UUID']['input'];
};


export type QueryRootUsersByRoleArgs = {
  roleName: Scalars['String']['input'];
};

export type RefreshTokenInput = {
  refreshToken: Scalars['String']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type RequestPasswordResetInput = {
  email: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
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