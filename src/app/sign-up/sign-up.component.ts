import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { TierionService } from '../services/tierion/tierion.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  userName: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;

  constructor(fb: FormBuilder,
    private tierionService: TierionService) {
      this.signUpForm = fb.group({
          "userName": ['', Validators.required],
          "email": ['', Validators.required],
          "password": ['', Validators.required],
      });

      this.userName = this.signUpForm.controls['userName'];
      this.email = this.signUpForm.controls['email'];
      this.password = this.signUpForm.controls['password'];
    }

  ngOnInit() {

  }

  public addUser(form: any){
  //  this.http.post('/api/')
    this.tierionService.signUpUser(form).subscribe( res => {
    })
  }

}
