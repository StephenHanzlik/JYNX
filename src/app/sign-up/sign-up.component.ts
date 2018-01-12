import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl,  } from '@angular/forms';
import { Response, Http } from '@angular/http';
import { TierionService } from '../services/tierion/tierion.service';
import {Routes, Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;

  constructor(private fb: FormBuilder,
              private http: Http,
              private router: Router) {

      this.signUpForm = fb.group({
          "username": ['', Validators.required],
          "email": ['', Validators.required],
          "password": ['', Validators.required],
      });
      this.username = this.signUpForm.controls['username'];
      this.email = this.signUpForm.controls['email'];
      this.password = this.signUpForm.controls['password'];
    }

  ngOnInit() {

  }

  public addUser(form: any){
    if(form.email && form.password && form.username){
      this.http.post('/api/sign-up', form).subscribe( res => {
        this.router.navigateByUrl('/log-in');
      })
    }
    //post directly to tierion DB.   My be deppricated after node route is finsihed
    //this.tierionService.signUpUser(form).subscribe( res => {
    //})
  }

}
