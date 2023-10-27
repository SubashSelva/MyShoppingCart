import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  id:number; editMode=false;

  constructor(private route:ActivatedRoute){

  }

  ngOnInit(): void {
    this.route.params.subscribe((param:Params)=>{
      let recipeId = param["id"];
      if(recipeId==null || recipeId==undefined)
        this.editMode=false;
      else
        this.editMode=true;
    })
  }

}
