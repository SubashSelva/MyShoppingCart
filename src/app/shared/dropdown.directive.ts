import { Directive, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open') addOpenClass=false;

  @HostListener('click') appDropdown(){
      this.addOpenClass=!this.addOpenClass;
  }

  constructor() { }
}
