import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  first_name = '';
  last_name = '';
  email = '';
  password = '';
  password_confirm = '';

  constructor() { }

  ngOnInit(): void {
  }

  submit(): void {
    console.log({
      first_name : this.first_name,
      last_name : this.last_name,
      email : this.email,
      password : this.password,
      password_confirm : this.password_confirm
    });
    
  }

}
