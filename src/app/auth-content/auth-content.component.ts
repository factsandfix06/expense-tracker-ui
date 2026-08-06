import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'

@Component({
  selector: 'app-auth-content',
  templateUrl: './auth-content.component.html',
  styleUrls: ['./auth-content.component.css']
})
export class AuthContentComponent implements OnInit {

  data:string[] = [];
  constructor(private http : HttpClient){}

  ngOnInit():void{
    this.http.get<string[]>('/message').subscribe(
      (response) => {
        this.data = response; 
        console.log('Messages:', this.data); 
      },
      (error) => {
        console.error('Error fetching messages:', error); 
      }
    );
  }

}
