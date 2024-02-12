import { Injectable, NgZone, inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { map, take } from "rxjs/operators";
import { UserInfo } from "./user.model";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import firebase from "firebase/compat/app";

export interface AuthResponseModel {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: string
}



@Injectable({
    providedIn: 'root'
})

export class AuthService {

    userInfo = new BehaviorSubject<UserInfo>(null);
    tokenExpirationTimer: any;
    loggedInUser: UserInfo;

    constructor(private router: Router, private fireAuth: AngularFireAuth,
        private ngZone: NgZone) {

    }


    async signUp(email: string, password: string) {

        return await this.fireAuth.createUserWithEmailAndPassword(email, password)
            .then(() => console.log("User Logged In!"))
            .catch(err => console.log("SignUp Failed!", err));
    }

    async signIn(email: string, password: string) {

        return await this.fireAuth.signInWithEmailAndPassword(email, password)
            .then(() => console.log("User Logged In!"))
            .catch(err => console.log("SignIn Failed!", err));
    }

    async signInWithGoogle() {
        return await this.authProviderLogin(new firebase.auth.GoogleAuthProvider());
    }

    async authProviderLogin(provider: firebase.auth.AuthProvider) {

        return await this.fireAuth.signInWithRedirect(provider)
            .then(() => console.log("User Logged In!"))
            .catch(err => console.log("authProviderLogin Failed!", err));
    }

    async forgotPassword(email: string) {

        return await this.fireAuth.sendPasswordResetEmail(email)
            .then(() => alert("Password reset email is triggered!, Please check you inbox."))
            .catch(err => {
                console.log("Forgot Passwork action failed!..", err);
            });
    }

    async signOut() {
        return await this.fireAuth.signOut()
            .then(() => { this.logoutCallback(); console.log("User Logged Out!"); })
            .catch(err => console.log("User SignOut Failed!", err));
    }

    async handleUserAuthData(user: firebase.User) {
        return await user.getIdTokenResult()
            .then(tokenObj => {
                this.loggedInUser = new UserInfo(
                    user.email, user.uid, tokenObj.token,
                    new Date(tokenObj.expirationTime), true);
                this.userInfo.next(this.loggedInUser);
                localStorage.setItem("userData", JSON.stringify(this.loggedInUser));
                this.ngZone.run(() => { this.router.navigate(['/recipes']) });
            }).catch(errObj => {
                console.log("handleUserAuthData", errObj)
            })
    }

    logoutCallback() {
        this.userInfo.next(null);
        if (this.tokenExpirationTimer)
            this.tokenExpirationTimer = null;
        localStorage.removeItem('userData');
        this.ngZone.run(() => { this.router.navigate(['/auth']) });
    }
}

export const AuthGuardActivation: CanActivateFn =
    (
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) => {

        const authService = inject(AuthService);
        const router = inject(Router);

        return authService.userInfo.pipe(take(1), map(user => {
            const isAuth = !!user;
            if (isAuth)
                return true;
            return router.createUrlTree(['/auth']);
        }))
    }