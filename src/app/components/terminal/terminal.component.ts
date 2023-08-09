import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgTerminal } from 'ng-terminal';
import { Observable, filter, map } from 'rxjs';
import { DataState } from 'src/app/interfaces/data-state';
import { MachinesService } from 'src/app/services/machines.service';
import { TerminalService } from 'src/app/services/terminal.service';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css'],
})
export class TerminalComponent implements OnInit, AfterViewInit {
  machines$ = new Observable<{ [k: string]: any } | null>();
  @ViewChild('terminal', { static: false }) terminal!: NgTerminal;
  constructor(
    private _store: Store<{
      data: DataState;
    }>,
    private _terminalService: TerminalService,
  ) {}
  ngOnInit(): void {
    this.machines$ = this._store.pipe(
      filter((s) => s.data.machines != null),
      map((state) => {
        this._terminalService.write("New Machines are available")
        return state.data.machines;
      })
    );
  }
  ngAfterViewInit(): void {
    this._terminalService.terminal = this.terminal;
    this._terminalService.underlying = this.terminal.underlying;
    this._terminalService.configure();   
  }
}
