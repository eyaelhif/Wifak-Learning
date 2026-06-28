package wifak.bank.backend.Controllers;

import jakarta.validation.Valid;
import wifak.bank.backend.Dtos.Permission.CreatePermissionRequest;
import wifak.bank.backend.Dtos.Permission.PermissionResponseDto;
import wifak.bank.backend.Dtos.Permission.UpdatePermissionRequest;
import wifak.bank.backend.Services.PermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionService permissionService;

    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<List<PermissionResponseDto>> getAllPermissions() {
        return ResponseEntity.ok(permissionService.getAllPermissions());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<PermissionResponseDto> getPermissionById(@PathVariable Long id) {
        return ResponseEntity.ok(permissionService.getPermissionById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<PermissionResponseDto> createPermission(
            @Valid @RequestBody CreatePermissionRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(permissionService.createPermission(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<PermissionResponseDto> updatePermission(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePermissionRequest request
    ) {
        return ResponseEntity.ok(permissionService.updatePermission(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        permissionService.deletePermission(id);
        return ResponseEntity.noContent().build();
    }
}
