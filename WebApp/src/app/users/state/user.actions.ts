import { createAction, props } from '@ngrx/store';
import { UserState } from './user.reducer';

export const signIn = createAction(
  '[User] Signed in',
  props<{ user: UserState}>()
)

export const changeUsername = createAction(
  '[User] Changed username',
  props<{ username: string}>()
)

export const changePicture = createAction(
  '[User] Changed picture',
  props<{ picture: string}>()
)

export const logoutUser = createAction(
  '[User] Logout'
)