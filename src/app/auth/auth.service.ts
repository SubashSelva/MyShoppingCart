import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, map, take, tap } from "rxjs/operators";
import { User } from "./user.model";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";

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

    userInfo = new BehaviorSubject<User>(null);
    tokenExpirationTimer: any;

    constructor(private httpClient: HttpClient, private router: Router) {

    }

    autoLogin() {
        var userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));

        if (!userData)
            return;

        var loggedInUser = new User(
            userData.email,
            userData.id,
            userData._token,
            new Date(userData._tokenExpirationDate)
        )

        if (loggedInUser.token) {
            this.userInfo.next(loggedInUser);

            var tokenExpiryInMilliSeconds = new Date(userData._tokenExpirationDate).getTime()
                - new Date().getTime();

            this.autoLogout(tokenExpiryInMilliSeconds);
        }

    }

    signUp(email: string, password: string) {
        var postData = { email: email, password: password, returnSecureToken: true };
        return this.httpClient.post<AuthResponseModel>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC7pDNzHkWfKQWprC7TtUZh2W-gk8w9sNI'
            , postData)
            .pipe(catchError(this.HandleErrors), tap(resObj => {
                this.HandleAuthData(resObj.email, resObj.localId, resObj.idToken, +resObj.expiresIn);
            }));
    }
    login(email: string, password: string) {
        var postData = { email: email, password: password, returnSecureToken: true };
        return this.httpClient.post<AuthResponseModel>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC7pDNzHkWfKQWprC7TtUZh2W-gk8w9sNI'
            , postData)
            .pipe(catchError(this.HandleErrors), tap(resObj => {
                this.HandleAuthData(resObj.email, resObj.localId, resObj.idToken, +resObj.expiresIn);
            }));
    }

    logout() {
        this.userInfo.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(tokenExpiryInMilliSeconds: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, tokenExpiryInMilliSeconds);
    }

    private HandleAuthData(email: string, id: string, token: string, expirysIn: number) {
        let expiryDate = new Date(new Date().getTime() + expirysIn * 1000);
        let user = new User(email, id, token, expiryDate);
        this.userInfo.next(user);
        this.autoLogout(expirysIn * 1000);
        localStorage.setItem("userData", JSON.stringify(user));
    }
    private HandleErrors(errorRes: HttpErrorResponse) {
        let errorMsg = "An unknown error occured!";
        if (errorRes.error && errorRes.error.error) {
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMsg = "An email id already exists!";
                    break;
                case 'INVALID_LOGIN_CREDENTIALS':
                    errorMsg = "An email id/password is invalid!";
                    break;
            }
        }
        return throwError(() => errorMsg);
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