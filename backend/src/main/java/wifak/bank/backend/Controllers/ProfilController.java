package wifak.bank.backend.Controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import wifak.bank.backend.Dtos.Profil.CreateProfilRequestDto;
import wifak.bank.backend.Dtos.Profil.ProfilResponseDto;
import wifak.bank.backend.Dtos.Profil.UpdateProfilRequestDto;
import wifak.bank.backend.Services.ProfilService;

import java.util.List;

@RestController
@RequestMapping("/api/profils")
@RequiredArgsConstructor
public class ProfilController {

    private final ProfilService profilService;

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<List<ProfilResponseDto>> getAllProfils() {

        return ResponseEntity.ok(
                profilService.getAllProfils()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<ProfilResponseDto> getProfilById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                profilService.getProfilById(id)
        );
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<ProfilResponseDto> createProfil(
            @Valid @RequestBody CreateProfilRequestDto request
    ) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(
                        profilService.createProfil(request)
                );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<ProfilResponseDto> updateProfil(
            @PathVariable Long id,
            @Valid @RequestBody UpdateProfilRequestDto request
    ) {

        return ResponseEntity.ok(
                profilService.updateProfil(id, request)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<Void> deleteProfil(
            @PathVariable Long id
    ) {

        profilService.deleteProfil(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<Void> assignPermissionsToProfil(
            @PathVariable Long id,
            @RequestBody List<Long> permissionIds
    ) {

        profilService.assignPermissionsToProfil(id, permissionIds);

        return ResponseEntity.ok().build();
    }
}