import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';

import toastr from "toastr"
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    if (this.currentAction == 'new')
      this.createCategory();
    else
      this.updateCategory();
  }

  //private methods

  setCurrentAction() {
    if (this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new'
    else
      this.currentAction = 'edit'
  }

  buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }

  loadCategory() {
    if (this.currentAction == 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      ).subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category) //binds loaded category data to categoryForm
        },
        (error) => alert('Ocorreu um erro no servidor. tente mais tarde')
      )
    }
  }

  setPageTitle() {
    if (this.currentAction == 'new') {
      this.pageTitle = 'Cadastro de nova categoria';
      console.log(this.pageTitle);
    }
    else {
      const categoryName = this.category.name || '';
      this.pageTitle = 'Editando categoria' + categoryName;
      console.log(this.pageTitle, this.category.name);
    }
  }

  createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(
      category => this.actionsForSucess(category),
      error => this.actionsForError(error)
    )
  }

  updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(
      category => this.actionsForSucess(category),
      error => this.actionsForError(error)
    )
  }

  //redirect/reload component page
  actionsForSucess(category: Category) {
    toastr.success("Solicitação processada com sucesso!")
    this.router.navigateByUrl("categories", { skipLocationChange: true }).then(
      () => this.router.navigate(["categories", category.id, 'edit'])
    )

  }

  actionsForError(error) {
    toastr.error("Erro ao processar sua solicitação");

    this.submittingForm = false;

    if (error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ['falha na comunicação com o servidor']
  }
}
