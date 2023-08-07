import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SpinnerState } from 'src/app/interfaces/spinner-state';

export const selectSpinnerState = createFeatureSelector<SpinnerState>('spinner');

export const selectIsLoading = createSelector(
  selectSpinnerState,
  (state: SpinnerState) => state.isLoading
);
