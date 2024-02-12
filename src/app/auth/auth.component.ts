import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import * as firebase from "firebase/compat";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})

export class AuthComponent implements OnInit, OnDestroy {

    constructor(private authService: AuthService,
        private router: Router, private fireAuth: AngularFireAuth) {
    }
    

    isLoginMode = true;
    isLoading = false;
    errorMsg = '';
    userLoggedIn = false;
    fireAuthStageUnsubscibe = null;

    async ngOnInit(): Promise<void> {

        this.isLoading = true;
        this.fireAuthStageUnsubscibe = this.fireAuth.onAuthStateChanged((user) => {
            if (user != null) {
                this.userLoggedIn = true;
                this.authService.handleUserAuthData(user)
                    .then()
                    .catch(errObj => console.log(errObj));
                    this.isLoading = false;
            }
            else {
                this.userLoggedIn = false;
                this.isLoading = false;
            }
        });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
        this.errorMsg = null;
    }

    async onSubmit(authForm: NgForm) {

        if (!authForm.valid)
            return;

        this.isLoading = true;
        let emailId = authForm?.value?.emailId;
        let password = authForm?.value?.password;
        let authPromise: Promise<void>;


        if (!this.isLoginMode)
            authPromise = this.authService.signUp(emailId, password);
        else
            authPromise = this.authService.signIn(emailId, password);

        await authPromise.then(() => {
            this.isLoading = false;
            this.errorMsg = null;
        }).catch(err => {
            console.log(err);
            this.errorMsg = err;
            this.isLoading = false;
        })
        authForm.reset();
    }

    async signInWithGoogle() {

        if (this.userLoggedIn)
            this.router.navigate(['/recipes']);

        this.isLoading = true;
        await this.authService.signInWithGoogle();
        this.isLoading = false;
    }

    async ngOnDestroy(): Promise<void> {
        (await this.fireAuthStageUnsubscibe)();
    }
}