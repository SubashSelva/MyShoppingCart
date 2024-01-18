import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";

interface AuthResponseModel {
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    constructor(private httpClient: HttpClient) {

    }

    signUp(email: string, password: string) {
        var postData = { email: email, password: password, returnSecureToken: true };
        return this.httpClient.post<AuthResponseModel>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC7pDNzHkWfKQWprC7TtUZh2W-gk8w9sNI'
            , postData)
            .pipe(catchError(errorRes=>{
                let errorMsg="An unknown error occured!";

                if(errorRes.error && errorRes.error.error){
                    switch(errorRes.error.error.message){
                        case 'EMAIL_EXISTS' :
                        errorMsg="An email id already exists!";
                    }
                }
                return throwError(()=>errorMsg);
            }));
    }
}