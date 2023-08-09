import { createAction, props } from '@ngrx/store';

export const jsonParsedSuccess = createAction(
  '[JsonFile] JSON Parsed Success',
  props<{ json: any }>()
);

export const jsonParsedFailure = createAction(
  '[JsonFile] JSON Parsed Failure',
  props<{ error: any }>()
);

export const machinesGrouped = createAction(
  '[Data] Machines Grouped',
  props<{ machines: { [k: string]: any[] } }>()
);

export const updateMachine = createAction(
  '[Machine] Update Machine',
  props<{ machineId: string; machine: any }>()
);