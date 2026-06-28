import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { ProfilGuard } from './guards/profil.guard';

import { HomeComponent } from './pages/home/home.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { CommunityComponent } from './pages/community/community.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AiAnalysisComponent } from './pages/ai-analysis/ai-analysis.component';

const routes: Routes = [
  { path: 'access-denied', component: AccessDeniedComponent },
  {
    path: 'frontoffice',
    canActivate: [AuthGuard, ProfilGuard],
    data: { profils: ['ETUDIANT', 'TUTEUR', 'ADMIN', 'PROF', 'Prof'] },
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'courses/:id/ai', component: AiAnalysisComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'profile', component: ProfileComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: 'frontoffice/home', pathMatch: 'full' },
  { path: '**', redirectTo: 'frontoffice/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
