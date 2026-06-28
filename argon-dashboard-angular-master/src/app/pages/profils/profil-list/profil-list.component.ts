import { Component, OnInit } from '@angular/core';

import { Profil } from '../../../models/profil.model';
import { ProfilService } from '../../../services/profil.service';

@Component({
  selector: 'app-profil-list',
  templateUrl: './profil-list.component.html',
  styleUrls: ['./profil-list.component.scss']
})
export class ProfilListComponent implements OnInit {
  profils: Profil[] = [];
  loading = false;
  message = '';
  error = '';

  constructor(private profilService: ProfilService) {}

  ngOnInit(): void {
    this.loadProfils();
  }

  loadProfils(): void {
    this.loading = true;
    this.error = '';

    this.profilService.getProfils().subscribe({
      next: (profils) => {
        this.profils = profils;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load profiles.';
        this.loading = false;
      }
    });
  }

  deleteProfil(profil: Profil): void {
    if (!confirm(`Delete ${profil.name}?`)) {
      return;
    }

    this.loading = true;
    this.profilService.deleteProfil(profil.id).subscribe({
      next: () => {
        this.message = 'Profile deleted successfully.';
        this.loadProfils();
      },
      error: () => {
        this.error = 'Unable to delete profile.';
        this.loading = false;
      }
    });
  }
}
