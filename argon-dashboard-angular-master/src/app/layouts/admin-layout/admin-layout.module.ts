import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';

import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { UserListComponent } from '../../pages/users/user-list/user-list.component';
import { UserFormComponent } from '../../pages/users/user-form/user-form.component';
import { UserPermissionsComponent } from '../../pages/users/user-permissions/user-permissions.component';
import { PermissionListComponent } from '../../pages/permissions/permission-list/permission-list.component';
import { PermissionFormComponent } from '../../pages/permissions/permission-form/permission-form.component';
import { ProfilListComponent } from '../../pages/profils/profil-list/profil-list.component';
import { ProfilFormComponent } from '../../pages/profils/profil-form/profil-form.component';
import { ProfilPermissionsComponent } from '../../pages/profils/profil-permissions/profil-permissions.component';
import { CourseListComponent } from '../../pages/courses/course-list/course-list.component';
import { CourseFormComponent } from '../../pages/courses/course-form/course-form.component';
import { CourseStudioComponent } from '../../pages/courses/course-studio/course-studio.component';
import { QuizListComponent } from '../../pages/quizzes/quiz-list/quiz-list.component';
import { QuizBuilderComponent } from '../../pages/quizzes/quiz-builder/quiz-builder.component';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    HasPermissionDirective,
    UserListComponent,
    UserFormComponent,
    UserPermissionsComponent,
    PermissionListComponent,
    PermissionFormComponent,
    ProfilListComponent,
    ProfilFormComponent,
    ProfilPermissionsComponent,
    CourseListComponent,
    CourseFormComponent,
    CourseStudioComponent,
    QuizListComponent,
    QuizBuilderComponent
  ]
})

export class AdminLayoutModule {}
