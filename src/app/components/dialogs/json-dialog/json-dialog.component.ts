import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { DataState } from 'src/app/interfaces/data-state';

@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.component.html',
  styleUrls: ['./json-dialog.component.css'],
})
export class JsonDialogComponent implements OnInit {
  jsonFile$ = new Observable<{ [k: string]: any } | null>();
  constructor(
    private _store: Store<{
      data: DataState;
    }>,
    public dialogRef: MatDialogRef<JsonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    this.jsonFile$ = this._store.pipe(map((s)=>s.data.json))
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
