package wifak.bank.backend.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wifak.bank.backend.Dtos.Profil.CreateProfilRequestDto;
import wifak.bank.backend.Dtos.Profil.ProfilResponseDto;
import wifak.bank.backend.Dtos.Profil.UpdateProfilRequestDto;
import wifak.bank.backend.Repositories.PermissionRepository;
import wifak.bank.backend.Repositories.ProfilRepository;
import wifak.bank.backend.entities.Permission;
import wifak.bank.backend.entities.Profil;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfilService {

    private final ProfilRepository profilRepository;
    private final PermissionRepository permissionRepository;

    public List<ProfilResponseDto> getAllProfils() {

        return profilRepository.findAll()
                .stream()
                .map(ProfilResponseDto::fromEntity)
                .toList();
    }

    public ProfilResponseDto getProfilById(Long id) {

        Profil profil = profilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil not found"));

        return ProfilResponseDto.fromEntity(profil);
    }

    public ProfilResponseDto createProfil(CreateProfilRequestDto request) {

        if (profilRepository.existsByName(request.getName())) {
            throw new RuntimeException("Profil already exists");
        }

        Profil profil = Profil.builder()
                .name(request.getName())
                .build();

        return ProfilResponseDto.fromEntity(
                profilRepository.save(profil)
        );
    }

    public ProfilResponseDto updateProfil(Long id, UpdateProfilRequestDto request) {

        Profil profil = profilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil not found"));

        profil.setName(request.getName());

        return ProfilResponseDto.fromEntity(
                profilRepository.save(profil)
        );
    }

    public void deleteProfil(Long id) {

        Profil profil = profilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil not found"));

        profilRepository.delete(profil);
    }

    public void assignPermissionsToProfil(Long profilId, List<Long> permissionIds) {

        Profil profil = profilRepository.findById(profilId)
                .orElseThrow(() -> new RuntimeException("Profil not found"));

        Set<Permission> permissions = new HashSet<>(
                permissionRepository.findAllById(permissionIds)
        );

        profil.setPermissions(permissions);

        profilRepository.save(profil);
    }
}