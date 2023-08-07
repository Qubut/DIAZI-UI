import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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
  data: { [k: string]: any } = {};
  constructor(private _fb: FormBuilder) {
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
    console.log(this.selectedFile);
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
        this.data = JSON.parse(content);
      } catch (error) {
        this.jsonParseError = true;
        this.selectedFile = null;
        this.display.patchValue(null);
      }
    };

    fileReader.readAsText(this.selectedFile!);
    this.display.patchValue(this.selectedFile!.name ?? null);
  }
  sendFile() {
    this.isFileValid = false;
  }
}
