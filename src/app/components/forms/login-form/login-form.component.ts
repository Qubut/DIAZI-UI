import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthenticationState } from 'src/app/interfaces/authentication-state';
import { login } from 'src/app/stores/authentication/authentication.actions';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  form: FormGroup;
  usernameMaxLength = 15;
  passwordMaxLength = 16;
  @Output() authenticate = new EventEmitter<string>();

  constructor(
    private _fb: FormBuilder,
    private _store: Store<AuthenticationState>
  ) {
    this.form = this._fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/[a-zA-Z]+/),
        Validators.maxLength(this.usernameMaxLength),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.maxLength(this.passwordMaxLength),
      ]),
    });
  }

  ngOnInit(): void {}
  async onSubmit() {
    const data = this.form.value;
    this.reset();
    this._store.dispatch(login(data));
  }

  checkForm(k: string, e: string) {
    return this.form.get(k)?.touched && this.form.get(k)?.hasError(e);
  }
  reset() {
    if (this.form.valid) {
      this.form.markAsPristine();
      this.form.reset();
      Object.keys(this.form.controls).forEach((key: string) => {
        this.form.controls[key].setErrors(null);
      });
    }
  }
}
