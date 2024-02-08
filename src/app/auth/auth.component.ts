import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})

export class AuthComponent implements OnInit {

    constructor(private authService: AuthService,
        private router: Router, private fireAuth: AngularFireAuth) {
    }

    isLoginMode = true;
    isLoading = false;
    errorMsg = '';
    userLoggedIn = false;

    ngOnInit(): void {
        this.isLoading = true;
        this.fireAuth.onAuthStateChanged((user) => {
            
            if (user != null) {
                this.userLoggedIn = true;
                this.authService.handleUserAuthData(user).then(resObj => {
                    this.isLoading = false;
                    console.log("User LoggedIn!");
                }).catch(errObj => console.log(errObj));
            }
            else {
                this.userLoggedIn = false;
                this.authService.signOut().then(() => {
                    this.isLoading = false;
                    console.log("User LoggedOut!");
                });
            }
        });
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

        authPromise.then(() => {
            console.log("User LoggedIn!");
            this.isLoading = false;
            this.errorMsg = null;
        }).catch(err => {
            console.log(err);
            this.errorMsg = err;
            this.isLoading = false;
        })
        authForm.reset();
    }

    signInWithGoogle() {
        if (this.userLoggedIn)
            this.router.navigate(['/recipes']);

        this.isLoading = true;
        this.authService.signInWithGoogle().then(() => {
            console.log("User LoggedIn!");
            this.errorMsg = null;
        }).catch((err: string) => {
            console.log(err);
            this.errorMsg = err;
        });
        this.isLoading = false;
    }
}