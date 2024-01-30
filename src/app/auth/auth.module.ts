import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { SharedModule } from "../shared/shared.module";
import { RouterModule, Routes } from "@angular/router";


const appRoutes: Routes = [
    { path: '', component: AuthComponent }
]

@NgModule({
    declarations: [AuthComponent],
    imports: [SharedModule, RouterModule.forChild(appRoutes)],
    exports:[RouterModule]
})

export class AuthModule{}
