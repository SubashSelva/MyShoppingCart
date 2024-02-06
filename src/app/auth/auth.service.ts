import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
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

    constructor(private httpClient: HttpClient, private router: Router,
        private fireAuth: AngularFireAuth) {

        this.fireAuth.authState.subscribe((user) => {
            if (user)
                this.HandleUserAuthData(user);
            else
                localStorage.removeItem("userData");
        })
    }

    autoLogin() {
        var userData = JSON.parse(localStorage.getItem('userData'));

        if (!userData)
            return;

        var loggedInUser = new UserInfo(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate),
            userData.isGoogleSignIn
        )

        if (loggedInUser.token) {
            this.userInfo.next(loggedInUser);

            var tokenExpiryInMilliSeconds = new Date(
                userData._tokenExpirationDate)
                .getTime() - new Date().getTime();

            this.autoLogout(tokenExpiryInMilliSeconds);
            this.router.navigate(['/recipes']);
        }
    }

    async signUp(email: string, password: string) {

        return await this.fireAuth
            .createUserWithEmailAndPassword(email, password)
            .then((user) => {
                this.HandleUserAuthData(user.user);
            }).catch(err => {
                console.log("SignUp Failed!..", err);
            });
    }

    async signIn(email: string, password: string) {

        return await this.fireAuth
            .signInWithEmailAndPassword(email, password)
            .then((user) => {
                this.HandleUserAuthData(user.user);
            }).catch(err => {
                console.log("SignIn Failed!..", err);
            });
    }

    async forgotPassword(email: string) {

        await this.fireAuth
            .sendPasswordResetEmail(email)
            .then(() => {
                alert("Password reset email is triggered!, Please check you inbox.");
            }).catch(err => {
                console.log("Forgot Passwork action failed!..", err);
            });
    }

    async signInWithGoogle() {
        return await this.authLogin(new firebase.auth.GoogleAuthProvider());
    }

    async authLogin(provider: firebase.auth.AuthProvider) {

        try {
            const resObj = await this.fireAuth.signInWithPopup(provider);
            this.HandleUserAuthData(resObj.user);
        } catch (errObj) {
            console.log("SignInWithGoogle Failed!..", errObj);
        }

        // return this.fireAuth.authState.pipe(map(async user => {
        //     if (!user) {
        //         await this.fireAuth.signInWithRedirect(provider);
        //     }
        //     user.getIdTokenResult().then(res => {
        //         const loggedInUser = new UserInfo(
        //             user.email, user.uid, res.token,
        //             new Date(res.expirationTime), true);
        //         this.userInfo.next(loggedInUser);
        //         localStorage.setItem("userData", JSON.stringify(loggedInUser));
        //         this.router.navigate(['/recipes']);
        //     });
        // }));
    }

    async signOut() {
        await this.fireAuth.signOut().then(() => {
            this.logoutCallback();
        });
    }

    autoLogout(tokenExpiryInMilliSeconds: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.signOut().then();
        }, tokenExpiryInMilliSeconds);
    }

    private HandleUserAuthData(user: firebase.User) {
        console.log("HandleUserAuthData", user);
        user.getIdTokenResult().then(res => {
            this.loggedInUser = new UserInfo(
                user.email, user.uid, res.token,
                new Date(res.expirationTime), true);
            this.userInfo.next(this.loggedInUser);
            this.autoLogout(new Date(res.expirationTime).getMilliseconds());
            localStorage.setItem("userData", JSON.stringify(user));
        });
    }

    private logoutCallback() {
        this.userInfo.next(null);
        if (this.tokenExpirationTimer)
            this.tokenExpirationTimer = null;
        localStorage.removeItem('userData');
        this.router.navigate(['/auth']);
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