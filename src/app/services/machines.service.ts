import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from '../interfaces/data-state';
import { MqttClientState } from '../interfaces/mqtt-client-state';
import { filter, map, tap } from 'rxjs';
import { machinesGrouped } from '../stores/data/data.actions';

@Injectable({
  providedIn: 'root',
})
export class MachinesService {
  private readonly BASEDATE = '2023-07-18T22:00:00.000Z';

  constructor() {}

  /**
   * Groups machines by the 'externResourceIdPerson' property from a given JSON input.
   * Supports two different JSON structures: direct 'activities' and nested 'Resources'.
   * 
   * @param json The input JSON to be processed.
   * @returns Grouped machines by the 'externResourceIdPerson' property.
   * @throws Invalid format if structure is not recognized
   */
  groupMachines(json: { [k: string]: any }): { [k: string]: any[] } {
    if (this.hasActivities(json)) {
      return this.groupByExternResourceIdPerson(json['activities']);
    } else if (this.hasResourceActivities(json)) {
      const activities = json['Resources'].flatMap(
        (resource: { Activities: any[]; DisplayName: any }) => 
          resource.Activities.map((activity) => ({
            start: this.formatDate(activity.StartTime),
            end: this.formatDate(activity.EndTime),
            externProductId: '',
            externResourceIdPerson: resource.DisplayName,
            externProcessId: activity.State === 'Idle' ? 'Idle' : 'Busy',
            reason: 'commend'
          }))
      );
      return this.groupByExternResourceIdPerson(activities);
    } else {
      throw new Error('Invalid format');
    }
  }

  /**
   * Groups activities by the 'externResourceIdPerson' property.
   * 
   * @param activities Array of activities to be grouped.
   * @returns Grouped activities by the 'externResourceIdPerson' property.
   */
  private groupByExternResourceIdPerson(activities: { [k: string]: any }[]): { [k: string]: any[] } {
    return activities.reduce((groups, activity) => {
      const key = activity['externResourceIdPerson'];
      groups[key] = groups[key] || [];
      groups[key].push(activity);
      return groups;
    }, {});
  }

  /**
   * Formats a date by adding a specified amount of time (in seconds)
   * to a base date and returns the result in the format 'YYYY-MM-DD HH:MM:SS.SSSSSS'.
   * 
   * @param time The time in seconds to add to the base date.
   * @param baseDate (optional) The base date in ISO format. Defaults to BASEDATE.
   * @returns Formatted date string.
   */
  private formatDate(time: number, baseDate: string = this.BASEDATE): string {
    const date = new Date(baseDate);
    const seconds: number = Math.floor(time);
    const microseconds: number = Math.round((time - seconds) * 1e6);

    date.setSeconds(seconds);
    date.setMilliseconds(microseconds / 1000);

    const formattedMicroseconds: string = microseconds.toString().padStart(6, '0');
    const isoString: string = date.toISOString().slice(0, -1);

    return `${isoString.slice(0, 10)} ${isoString.slice(11, 19)}.${formattedMicroseconds}`;
  }

  /**
   * Checks if the input JSON has a direct 'activities' structure.
   * 
   * @param json The input JSON to be checked.
   * @returns True if the structure is recognized, otherwise false.
   */
  private hasActivities(json: { [k: string]: any }): boolean {
    return json.hasOwnProperty('activities') && Array.isArray(json['activities']) && json['activities'].length > 0;
  }

  /**
   * Checks if the input JSON has a nested 'Resources' structure.
   * 
   * @param json The input JSON to be checked.
   * @returns True if the structure is recognized, otherwise false.
   */
  private hasResourceActivities(json: { [k: string]: any }): boolean {
    return json.hasOwnProperty('Resources') && 
           json['Resources'].length > 0 && 
           json['Resources'][0].hasOwnProperty('Activities') && 
           Array.isArray(json['Resources'][0].Activities);
  }
}
