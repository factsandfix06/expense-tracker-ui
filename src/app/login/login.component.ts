import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  isRegistering: boolean = false;
  data:string[] = [];
  username: string = ''; 
  password: string = ''; 
  errorMessage: string = ''; 

  constructor(private http : HttpClient, private router: Router){}

  ngOnInit():void{}

  onSubmit(): void {
    const payload = {
      username: this.username,
      password: this.password,
    };
    this.http.post<{ token: string;username:string }>('http://localhost:8080/login', payload).subscribe(
      (response) => {
        // Save JWT token in localStorage
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('username', response.username);
        console.log(response.token)
        console.log(response.username)

        // Navigate to the dashboard
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }

  showRegistrationForm() {
    this.isRegistering = true;
  }

}
