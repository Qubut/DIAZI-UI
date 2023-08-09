import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { DataState } from 'src/app/interfaces/data-state';
import {
  jsonParsedFailure,
  jsonParsedSuccess,
} from 'src/app/stores/data/data.actions';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.css'],
})
export class UploadFormComponent implements OnInit {
  selectedFile: File | null = null;
  display: FormControl = new FormControl('');

  public uploadLimitSize = false;
  public jsonParseError = false;

  readonly maxSize: number = 2242880;

  @Input() size!: number | string;
  isFileValid = false;
  form: FormGroup;
  json: { [k: string]: any } = {};
  error: any;
  constructor(private _fb: FormBuilder, private _store: Store<DataState>) {
    this.form = this._fb.group({
      file: new FormControl(null, Validators.required), // Added Validators.required here
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid && this.selectedFile) {
      this.form.value.file = this.selectedFile;
      this.form.markAsPristine();
      this.form.reset();
      this.selectedFile = null;
      this.display.patchValue(null);
    }
  }

  handleFileInputChange(event: any) {
    this.jsonParseError = false;
    this.uploadLimitSize = false;
    this.selectedFile = event.target.files[0];
    this.selectedFile!.name.replace('C:\\fakepath\\', '');
    // Validate file size
    if (this.selectedFile!.size > this.maxSize) {
      this.uploadLimitSize = true;
      this.selectedFile = null;
      this.display.patchValue(null);

      return;
    }

    this.isFileValid = true;
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const content = fileReader.result as string;
        this.json = JSON.parse(content);
      } catch (error) {
        this.jsonParseError = true;
        this.selectedFile = null;
        this.display.patchValue(null);
        this.error = error;
      }
    };

    fileReader.readAsText(this.selectedFile!);
    this.display.patchValue(this.selectedFile!.name ?? null);
  }
  sendFile() {
    if (this.error)
      this._store.dispatch(jsonParsedFailure({ error: this.error }));
    else this._store.dispatch(jsonParsedSuccess({ json: this.json }));

    this.isFileValid = false;
  }
}
