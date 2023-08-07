import { createAction } from '@ngrx/store';

export const loadingStarted = createAction('[App] Loading Started');
export const loadingFinished = createAction('[App] Loading Finished');