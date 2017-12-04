import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QuillEditorModule } from 'ng2-quill-editor';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { MyDatePickerModule } from 'mydatepicker';
import { TextMaskModule } from 'angular2-text-mask';

import { ListErrorsComponent } from './list-errors.component';
import { TableComponent } from './components/table/table.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { AssignTaskComponent } from './components/assign-task/assign-task.component';
import { StyleLibraryComponent } from './components/style-library/style-library.component';

import { ShowAuthedDirective } from './show-authed.directive';

import { AuthInterceptor } from './interceptor';

export function HttpLoaderFactory (http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    QuillEditorModule,
    MultiselectDropdownModule,
    MyDatePickerModule,
    TextMaskModule,
    NgbModule.forRoot()
  ],
  declarations: [
    ListErrorsComponent,
    SpinnerComponent,
    TableComponent,
    ShowAuthedDirective,
    AssignTaskComponent,
    StyleLibraryComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ListErrorsComponent,
    RouterModule,
    SpinnerComponent,
    TableComponent,
    AssignTaskComponent,
    StyleLibraryComponent,
    ShowAuthedDirective,
    TranslateModule,
    QuillEditorModule,
    MultiselectDropdownModule,
    MyDatePickerModule,
    TextMaskModule,
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class SharedModule {}
