import { createReducer, on } from '@ngrx/store';
import { loadingStarted, loadingFinished } from './spinner.actions';
import { SpinnerState } from 'src/app/interfaces/spinner-state';

export const initialState: SpinnerState = {
  isLoading: false
};

export const spinnerReducer = createReducer(
  initialState,
  on(loadingStarted, state => ({ ...state, isLoading: true })),
  on(loadingFinished, state => ({ ...state, isLoading: false }))
);