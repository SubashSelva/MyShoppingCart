export class UserInfo {
    constructor(private email: string, private id: string,
        private _token: string, private _tokenExpirationDate: Date,
        private isGoogleSignIn: boolean) {

    }

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
            return null;
        return this._token;
    }
}