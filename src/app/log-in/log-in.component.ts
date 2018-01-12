import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl,  } from '@angular/forms';
import { Response, Http } from '@angular/http';
import {Routes, Router } from '@angular/router';


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
      this.authService.login(form).subscribe( res => {
          this.router.navigateByUrl('/settings');
      });
    }
  }
}
