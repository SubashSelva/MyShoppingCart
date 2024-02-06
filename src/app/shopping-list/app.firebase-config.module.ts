import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuth  } from "@angular/fire/compat/auth";

export const firebaseConfig = {
    apiKey: "AIzaSyDUeUeNqFr2Pg7ySZBHNgH6tpHh8Sv8ZVg",
    authDomain: "my-shopping-cart-6ce48.firebaseapp.com",
    databaseURL: "https://my-shopping-cart-6ce48-default-rtdb.firebaseio.com",
    projectId: "my-shopping-cart-6ce48",
    storageBucket: "my-shopping-cart-6ce48.appspot.com",
    messagingSenderId: "1082668732977",
    appId: "1:1082668732977:web:e43239229e9030e0aa7b10",
    measurementId: "G-S6K0C5C3RM"
  };

@NgModule({
    imports:[
        AngularFireModule.initializeApp(firebaseConfig),
    ],
    providers:[
        AngularFireAuth
    ]
})

export class FirebaseConfigModule{

}