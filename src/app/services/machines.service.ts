import { Injectable } from '@angular/core';

export interface ActivitiesState {
  activities: { [k: string]: any }[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  constructor() {}
}
