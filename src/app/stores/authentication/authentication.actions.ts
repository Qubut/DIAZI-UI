import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login Page] Login',
  props<{ username: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ token: string }>()
);

export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: any }>()
);
export const sendToken = createAction(
  '[Auth API] Send Token',
  props<{ token: string }>()
);

export const sendTokenSuccess = createAction('[Auth API] Send Token Success');

export const sendTokenFailure = createAction(
  '[Auth API] Send Token Failure',
  props<{ error: any }>()
);
