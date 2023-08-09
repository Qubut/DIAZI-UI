import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs';
import { DataState } from 'src/app/interfaces/data-state';
import { TerminalService } from 'src/app/services/terminal.service';
import { JsonDialogComponent } from '../dialogs/json-dialog/json-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-json-viewer',
  templateUrl: './json-viewer.component.html',
  styleUrls: ['./json-viewer.component.css'],
})
export class JsonViewerComponent implements OnInit {
  data: any;
  constructor(
    private _store: Store<{
      data: DataState;
    }>,
    private _terminalService: TerminalService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this._store
      .pipe(
        filter((s) => s.data.json != null),
        map(async (state) => {
          if (this._terminalService.terminal && this.data != state.data.json) {
            this.data = state.data.json;
            (await state.data.machinesChanged)
              ? this._terminalService.write("machine's changes in JSON Viewer")
              : this._terminalService.write('JSON Viewer recieved Data');
          }

          return state.data.json;
        })
      )
      .subscribe();
  }
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
    const dialogRef = this.dialog.open(JsonDialogComponent, {
      height: '70vh',
      width: '80vw',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }
}
