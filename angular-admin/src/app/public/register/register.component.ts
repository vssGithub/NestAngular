import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', './../public.component.css']
})
export class RegisterComponent implements OnInit {

  first_name = '';
  last_name = '';
  email = '';
  password = '';
  password_confirm = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.http.post(`${environment.api}/register`, {
      first_name : this.first_name,
      last_name : this.last_name,
      email : this.email,
      password : this.password,
      password_confirm : this.password_confirm
    }).subscribe(() => { this.router.navigate(['/login']); });
    
  }

}
