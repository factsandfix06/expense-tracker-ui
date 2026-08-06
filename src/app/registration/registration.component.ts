import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  username: string = ''; 
  password: string = ''; 

  constructor(private http:HttpClient,private router:Router){}

  onSubmit(): void {
    const payload = {
      username: this.username,
      password: this.password
    };
    this.http.post('http://localhost:8080/register', payload).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error during registration:', error);
        alert('Registration failed. Please try again.');
      }
    );
  }
}
