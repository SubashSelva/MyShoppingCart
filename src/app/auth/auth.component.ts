import { Component } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { AuthResponseModel, AuthService } from "./auth.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})

export class AuthComponent {

    constructor(private authService: AuthService, private router:Router) {

    }

    isLoginMode = true;
    isLoading = false;
    errorMsg = ''

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
        this.errorMsg=null;
    }

    onSubmit(authForm: NgForm) {
        if (!authForm.valid) {
            console.log("Form is Invalid");
            return;
        }

        this.isLoading = true;
        let emailId = authForm?.value?.emailId;
        let password = authForm?.value?.password;
        let authObservable: Observable<AuthResponseModel>;


        if (!this.isLoginMode)
            authObservable = this.authService.signUp(emailId, password);
        else
            authObservable = this.authService.login(emailId, password);

        authObservable.subscribe({
            next: (resObj: any) => {
                console.log(resObj);
                this.isLoading = false;
                this.errorMsg = null;
                this.router.navigate(['/recipes']);
            },
            error: (errorMsg: any) => {
                console.log(errorMsg);
                this.errorMsg = errorMsg;
                this.isLoading = false;
            }
        });
        authForm.reset();
    }
}