import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})

export class AuthComponent implements OnInit {

    constructor(private authService: AuthService,
        private router: Router, private fireAuth: AngularFireAuth, private activatedRoute: ActivatedRoute) {
    }

    isLoginMode = true;
    isLoading = false;
    errorMsg = '';
    userLoggedIn = false;

    ngOnInit(): void {
        this.fireAuth.onAuthStateChanged((user) => {
            if (user != null) {
                this.authService.HandleUserAuthData(user, "ngOnInit.onAuthStateChanged");
                this.userLoggedIn = true;
            }
            else {
                this.authService.signOut();
                this.userLoggedIn = false;
            }
        })
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
            this.router.navigate(['/recipes'], { relativeTo: this.activatedRoute });
        }).catch(errObj => {
            console.log(errObj);
            this.errorMsg = errObj;
            this.isLoading = false;
        })
        authForm.reset();
    }

    signInWithGoogle() {

        if (this.userLoggedIn) {
            this.router.navigate(['/recipes'], { relativeTo: this.activatedRoute });
            return;
        }

        this.isLoading = true;
        this.authService.signInWithGoogle().then(() => {
            alert("signInWithGoogle");
            this.errorMsg = null;
            this.router.navigate(['/recipes'], { relativeTo: this.activatedRoute });
        }).catch(errObj => {
            console.log(errObj);
            this.errorMsg = errObj;
        });
        this.isLoading = false;
    }
}