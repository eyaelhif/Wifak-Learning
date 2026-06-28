import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
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
import { PermissionGuard } from '../../guards/permission.guard';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    {
        path: 'tables',
        component: TablesComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['VIEW_STATISTICS', 'CREATE_QUIZ', 'EDIT_QUIZ', 'DELETE_QUIZ'] }
    },
    {
        path: 'icons',
        component: IconsComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['GENERATE_AI_CONTENT'] }
    },
    {
        path: 'maps',
        component: MapsComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['VALIDATE_CONTENT'] }
    },
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'users/new',
        component: UserFormComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'users/:id/edit',
        component: UserFormComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'users/:id/permissions',
        component: UserPermissionsComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'users/:id/profils',
        component: UserPermissionsComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'profils',
        component: ProfilListComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'profils/new',
        component: ProfilFormComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'profils/:id/edit',
        component: ProfilFormComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'profils/:id/permissions',
        component: ProfilPermissionsComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'courses',
        component: CourseListComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS', 'VALIDATE_CONTENT', 'GENERATE_AI_CONTENT', 'CREATE_QUIZ', 'EDIT_QUIZ'] }
    },
    {
        path: 'courses/new',
        component: CourseFormComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS', 'VALIDATE_CONTENT', 'GENERATE_AI_CONTENT'] }
    },
    {
        path: 'courses/:id/edit',
        component: CourseFormComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS', 'VALIDATE_CONTENT', 'GENERATE_AI_CONTENT'] }
    },
    {
        path: 'courses/:id/studio',
        component: CourseStudioComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS', 'VALIDATE_CONTENT', 'GENERATE_AI_CONTENT', 'CREATE_QUIZ', 'EDIT_QUIZ'] }
    },
    {
        path: 'quizzes',
        component: QuizListComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['CREATE_QUIZ', 'EDIT_QUIZ', 'DELETE_QUIZ', 'MANAGE_USERS'] }
    },
    {
        path: 'quizzes/new',
        component: QuizBuilderComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['CREATE_QUIZ', 'MANAGE_USERS'] }
    },
    {
        path: 'quizzes/:id/edit',
        component: QuizBuilderComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['EDIT_QUIZ', 'MANAGE_USERS'] }
    },
    {
        path: 'permissions',
        component: PermissionListComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'permissions/new',
        component: PermissionFormComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    },
    {
        path: 'permissions/:id/edit',
        component: PermissionFormComponent,
        canActivate: [PermissionGuard],
        data: { permissions: ['MANAGE_USERS'] }
    }
];
