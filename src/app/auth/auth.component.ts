import { Component } from "@angular/core";
import { FormGroup, NgForm } from "@angular/forms";
import { AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
})

export class AuthComponent {

    constructor(private authService:AuthService){

    }

    isLoginMode = true;
    isLoading=false;
    errorMsg=''

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(authForm : NgForm){
        
        if(!authForm.valid){
            console.log("Form is Invalid");
            return;
        }
        else if(!this.isLoginMode){

            this.isLoading=true;

            let emailId=authForm?.value?.emailId;
            let password=authForm?.value?.password;

            this.authService.signUp(emailId,password).subscribe(resObj=>{
                console.log(resObj);
                this.isLoading=false;
            },errorMsg=>{
                console.log(errorMsg);
                this.errorMsg=errorMsg;
                this.isLoading=false;
            });
        }
        else{
            //TODO
        }

        authForm.reset();
    }
}