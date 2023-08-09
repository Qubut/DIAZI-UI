// data.reducer.ts

import { createReducer, on } from '@ngrx/store';
import {
  jsonParsedSuccess,
  jsonParsedFailure,
  machinesGrouped,
  updateMachine,
} from './data.actions';
import { DataState } from 'src/app/interfaces/data-state';

export const initialState: DataState = {
  json: null,
  error: null,
  machines: null,
  machinesChanged:false
};

export const jsonFileReducer = createReducer(
  initialState,
  on(jsonParsedSuccess, (state, { json }) => ({
    ...state,
    json: structuredClone(json),
  })),
  on(machinesGrouped, (state, { machines }) => ({
    ...state,
    machines,
    machinesChanged:false
  })),
  on(jsonParsedFailure, (state, { error }) => ({ ...state, error })),
  on(updateMachine, (state, { machineId, machine }) => {
    const updatedMachines = {
      ...state.machines,
      [machineId]: machine,
    };

    const updatedJson = { ...state.json };
    updatedJson['activities'] = Object.values(updatedMachines).flat();

    return {
      ...state,
      machines: updatedMachines,
      json: updatedJson,
      machinesChanged:true
    };
  })
);
