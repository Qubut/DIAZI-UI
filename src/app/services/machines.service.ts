import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from '../interfaces/data-state';
import { MqttClientState } from '../interfaces/mqtt-client-state';
import { filter, map, tap } from 'rxjs';
import { machinesGrouped } from '../stores/data/data.actions';

export interface ActivitiesState {
  activities: { [k: string]: any }[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  constructor(
    private _store: Store<{ data: DataState; mqtt: MqttClientState }>
  ) {
   
  }
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
  getData(){
     return this._store.pipe(
      map((state) => state.mqtt.receivedMessages),
      filter(
        (messages) =>
          messages.hasOwnProperty('/resources') &&
          Array.isArray(messages['/resources']) &&
          messages['/resources'].length > 0
      ),
      map((messages) => {
        console.log(messages);
        return JSON.parse(messages['/resources'].pop() as string);
      }),
      tap((parsedMessage) => {
        this._store.dispatch(machinesGrouped({ machines: parsedMessage }));
      })
    );
  }
}
