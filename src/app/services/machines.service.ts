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
  groupByExternResourceIdPerson(activities: any[]): { [k: string]: any[] } {
    return activities.reduce((groups, activity) => {
      const key = activity.externResourceIdPerson;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(activity);
      return groups;
    }, {});
  }
}
