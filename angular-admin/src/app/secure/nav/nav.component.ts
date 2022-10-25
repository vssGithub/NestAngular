import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  user: User | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.user().subscribe(user => this.user = user)
  }

}
