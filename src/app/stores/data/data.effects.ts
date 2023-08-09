import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MachinesService } from 'src/app/services/machines.service';
import { jsonParsedSuccess, jsonParsedFailure, machinesGrouped } from './data.actions';

@Injectable()
export class DataEffects {

  parseJson$ = createEffect(() =>
    this.actions$.pipe(
      ofType(jsonParsedSuccess),
      map(action => action.json),
      map(json => {
        if (json.activities) {
          const machines = this.machinesService.groupByExternResourceIdPerson(json.activities);
          return machinesGrouped({ machines });
        } else {
          return jsonParsedFailure({ error: 'No activities in json' });
        }
      }),
      catchError((error) => of(jsonParsedFailure({ error })))
    )
  );

  constructor(private actions$: Actions, private machinesService: MachinesService) {}
}
