import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';

import { MachinesService } from 'src/app/services/machines.service';

@Injectable()
export class DataEffects {
  constructor(
    private actions$: Actions,
    private machinesService: MachinesService
  ) {}
}
