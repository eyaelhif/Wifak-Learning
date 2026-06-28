package wifak.bank.backend.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import wifak.bank.backend.Dtos.Permission.CreatePermissionRequest;
import wifak.bank.backend.Dtos.Permission.PermissionResponseDto;
import wifak.bank.backend.Dtos.Permission.UpdatePermissionRequest;
import wifak.bank.backend.Repositories.PermissionRepository;
import wifak.bank.backend.entities.Permission;

import java.util.List;


@Service
@RequiredArgsConstructor
public class PermissionService {

    private final PermissionRepository permissionRepository;

    public List<PermissionResponseDto> getAllPermissions() {
        return permissionRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PermissionResponseDto getPermissionById(Long id) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found with id: " + id));

        return mapToResponse(permission);
    }


    public PermissionResponseDto createPermission(CreatePermissionRequest request) {
        if (permissionRepository.existsByName(request.getName())) {
            throw new RuntimeException("Permission already exists with name: " + request.getName());
        }

        Permission permission = Permission.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        return mapToResponse(permissionRepository.save(permission));
    }

    public PermissionResponseDto updatePermission(Long id, UpdatePermissionRequest request) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found with id: " + id));

        permissionRepository.findByName(request.getName())
                .filter(existingPermission -> !existingPermission.getId().equals(id))
                .ifPresent(existingPermission -> {
                    throw new RuntimeException("Permission already exists with name: " + request.getName());
                });

        permission.setName(request.getName());
        permission.setDescription(request.getDescription());

        return mapToResponse(permissionRepository.save(permission));
    }


    public void deletePermission(Long id) {
        if (!permissionRepository.existsById(id)) {
            throw new RuntimeException("Permission not found with id: " + id);
        }

        permissionRepository.deleteById(id);
    }

    private PermissionResponseDto mapToResponse(Permission permission) {
        return new PermissionResponseDto(
                permission.getId(),
                permission.getName(),
                permission.getDescription()
        );
    }
}