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

export type AuthPayload = {
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
  user: User;
};

export type Invitation = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  expiresAt: Scalars['DateTime']['output'];
  id: Scalars['UUID']['output'];
  inviterUserId: Scalars['UUID']['output'];
  isUsed: Scalars['Boolean']['output'];
  usedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type InviteUserInput = {
  email: Scalars['String']['input'];
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
  inviteUser: Invitation;
  login: AuthPayload;
  logout: MessageResponse;
  refreshToken: AuthPayload;
  register: User;
  requestPasswordReset: MessageResponse;
  resetPassword: MessageResponse;
  verifyEmail: MessageResponse;
};


export type MutationRootAcceptInvitationArgs = {
  input: AcceptInvitationInput;
};


export type MutationRootInviteUserArgs = {
  input: InviteUserInput;
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
  health: Scalars['String']['output'];
  me: User;
  myInvitations: Array<Invitation>;
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

export type User = {
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['UUID']['output'];
  isEmailVerified: Scalars['Boolean']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { login: { accessToken: string, refreshToken: string, user: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean } } };

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
  invitationToken: Scalars['String']['input'];
  password: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
}>;


export type AcceptInvitationMutation = { acceptInvitation: { accessToken: string, refreshToken: string, user: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean } } };

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

export type HealthQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthQuery = { health: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { me: { id: any, email: string, firstName?: string | null, lastName?: string | null, isEmailVerified: boolean, createdAt: any, updatedAt: any } };


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
    mutation AcceptInvitation($invitationToken: String!, $password: String!, $firstName: String, $lastName: String) {
  acceptInvitation(
    input: {invitationToken: $invitationToken, password: $password, firstName: $firstName, lastName: $lastName}
  ) {
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
 *     invitationToken: // value for 'invitationToken'
 *     password: // value for 'password'
 *     firstName: // value for 'firstName'
 *     lastName: // value for 'lastName'
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