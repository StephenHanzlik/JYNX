import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl,  } from '@angular/forms';
import { Response, Http } from '@angular/http';
import {Routes, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { ShortenerService } from '../services/shortener/shortener.service';


@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private shortenerService: ShortenerService,
              private http: Http,
              private router: Router) {

    this.logInForm = fb.group({
        "email": ['', Validators.required],
        "password": ['', Validators.required],
    });
    this.email = this.logInForm.controls['email'];
    this.password = this.logInForm.controls['password'];
  }

  ngOnInit() {

  }

  public logInUser(form: any){
    if(form.email && form.password){
      this.authService.logIn(form).subscribe( res => {
          let result = JSON.parse((<any>res)._body);
          localStorage.setItem ('token', result.token);
          let req = {
            id: result.id
          }
          this.shortenerService.createShortLink(req).subscribe(res =>{
            //  console.log("result in create short link")

              let result = JSON.parse((<any>res)._body);
              this.router.navigate(['/admin/', result.shortUrl]);
          });

      });
    }
  }
}
