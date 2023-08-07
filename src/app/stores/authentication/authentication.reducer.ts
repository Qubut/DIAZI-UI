import { createReducer, on } from '@ngrx/store';
import {
  login,
  loginSuccess,
  loginFailure,
  sendTokenSuccess,
  sendTokenFailure,
} from './authentication.actions';
import { AuthenticationState } from 'src/app/interfaces/authentication-state';

export const authenticationFeatureKey = 'authentication';

export const initialState: AuthenticationState = {
  isAuthenticated: false,
  token: '',
  error: null,
  tokenSent: false,
};

export const authenticationReducer = createReducer(
  initialState,
  on(login, (state) => ({ ...state, isAuthenticated: false })),
  on(loginSuccess, (state, { token }) => ({
    ...state,
    isAuthenticated: true,
    token: token,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    isAuthenticated: false,
    error: error,
  })),
  on(sendTokenSuccess, (state) => ({ ...state, tokenSent: true })),
  on(sendTokenFailure, (state, { error }) => ({
    ...state,
    tokenSent: false,
    error: error,
  }))
);
