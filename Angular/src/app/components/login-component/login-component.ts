import { Component, inject } from '@angular/core';
import { Auth } from '../../service/auth';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../dto/login-request';

@Component({
  selector: 'login-component',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  auth = inject(Auth);
  username: string = '';
  password: string = '';
  showError: boolean = false;

  onClickLogin() {
    this.showError = false;
    const loginData: LoginRequest = {
      username: this.username,
      password: this.password,
    };
    this.auth.login(loginData, this.onLoginFail.bind(this));
  }

  onLoginFail(){
    this.showError = true;
  }
}
