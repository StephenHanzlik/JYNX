import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl,  } from '@angular/forms';
import { Response, Http } from '@angular/http';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {
  logInForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;

  constructor(fb: FormBuilder, private http: Http) {
    this.logInForm = fb.group({
        "userName": ['', Validators.required],
        "email": ['', Validators.required],
        "password": ['', Validators.required],
    });
    this.email = this.logInForm.controls['email'];
    this.password = this.logInForm.controls['password'];
  }

  ngOnInit() {

  }

  public logInUser(form: any){
    console.log("log in user in component");
    this.http.post('/api/log-in', form).subscribe( res => {
      console.log("res " + res);
    });
  }
}
