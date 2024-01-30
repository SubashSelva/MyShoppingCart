import { NgModule } from "@angular/core";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    declarations: [
        DropdownDirective,
        LoadingSpinnerComponent
    ],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [
        DropdownDirective,
        LoadingSpinnerComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ]
})


export class SharedModule {

}