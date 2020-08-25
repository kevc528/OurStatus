import { createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store'
import * as UserActions from './user.actions'

export interface State {
  user: UserState
}

export interface UserState {
  username: string;
  userId: string;
  picture: string;
  firstName: string;
  lastName: string
}

const initialState: UserState = {
  username: null,
  userId: null,
  picture: null,
  firstName: null,
  lastName: null
}

const getUserFeatureState = createFeatureSelector<UserState>('user');

export const getUsername = createSelector(
  getUserFeatureState,
  state => state.username
)

export const getUserId = createSelector(
  getUserFeatureState,
  state => state.userId
)

export const getPicture = createSelector(
  getUserFeatureState,
  state => state.picture
)

export const getName = createSelector(
  getUserFeatureState,
  state => state.firstName + ' ' + state.lastName
)

export const userReducer = createReducer<UserState>(
  initialState,
  on(UserActions.signIn, (state, action): UserState => {
    return {
      ...state,
      username: action.user.username,
      userId: action.user.userId,
      picture: action.user.picture,
      firstName: action.user.firstName,
      lastName: action.user.lastName
    }
  }),
  on(UserActions.changeUsername, (state, action): UserState => {
    return {
      ...state,
      username: action.username
    }
  }),
  on(UserActions.changePicture, (state, action): UserState => {
    return {
      ...state,
      picture: action.picture
    }
  }),
  on(UserActions.logoutUser, (state): UserState => {
    return {
      ...state,
      username: null,
      userId: null,
      picture: null,
      firstName: null,
      lastName: null
    }
  })
)