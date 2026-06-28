import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ProfilService } from '../../../services/profil.service';

@Component({
  selector: 'app-profil-form',
  templateUrl: './profil-form.component.html',
  styleUrls: ['./profil-form.component.scss']
})
export class ProfilFormComponent implements OnInit {
  form: FormGroup;
  profilId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profilService: ProfilService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.profilId = id ? Number(id) : null;

    if (this.profilId) {
      this.loadProfil(this.profilId);
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const request = this.profilId
      ? this.profilService.updateProfil(this.profilId, this.form.value)
      : this.profilService.createProfil(this.form.value);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => this.router.navigate(['/profils']),
      error: () => (this.error = 'Unable to save profile.')
    });
  }

  private loadProfil(id: number): void {
    this.loading = true;
    this.profilService.getProfil(id).pipe(finalize(() => (this.loading = false))).subscribe({
      next: (profil) => this.form.patchValue({ name: profil.name }),
      error: () => (this.error = 'Unable to load profile.')
    });
  }
}
