import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})

export class AuthComponent implements OnInit {

    constructor(private authService: AuthService, private router: Router) {
    }

    isLoginMode = true;
    isLoading = false;
    errorMsg = ''

    ngOnInit(): void {
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
        this.errorMsg = null;
    }

    onSubmit(authForm: NgForm) {
        if (!authForm.valid) {
            console.log("Form is Invalid");
            return;
        }

        this.isLoading = true;
        let emailId = authForm?.value?.emailId;
        let password = authForm?.value?.password;
        let authPromise: Promise<void>;


        if (!this.isLoginMode)
            authPromise = this.authService.signUp(emailId, password);
        else
            authPromise = this.authService.signIn(emailId, password);

        authPromise.then(resObj => {
            console.log(resObj);
            this.isLoading = false;
            this.errorMsg = null;
            this.router.navigate(['/recipes']);
        }).catch(errObj => {
            console.log(errObj);
            this.errorMsg = errObj;
            this.isLoading = false;
        })
        authForm.reset();
    }

    signInWithGoogle() {
        this.isLoading = true;
        this.authService.signInWithGoogle().then(resp => {
            this.errorMsg = null;
            console.log("Google Login Success!", resp);
            this.router.navigate(['/recipes']);
            console.log("Google Login Successaa!", resp);
        }).catch(errObj => {
            console.log(errObj);
            this.errorMsg = errObj;
        });
        this.isLoading = false;
    }
}