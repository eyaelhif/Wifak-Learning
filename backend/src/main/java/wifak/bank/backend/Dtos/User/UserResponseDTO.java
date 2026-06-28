package wifak.bank.backend.Dtos.User;

import lombok.Builder;
import lombok.Data;
import wifak.bank.backend.entities.Permission;
import wifak.bank.backend.entities.Profil;
import wifak.bank.backend.entities.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
public class UserResponseDTO {

    private Long id;

    private String fullName;

    private String email;

    private Boolean active;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime lastLoginAt;

    // PROFILS
    private Set<String> profils;

    // PERMISSIONS (flattened from profils)
    private Set<String> permissions;

    public static UserResponseDTO fromEntity(User user) {

        Set<Profil> userProfils = user.getProfils();

        Set<Permission> allPermissions = userProfils
                .stream()
                .flatMap(profil -> profil.getPermissions().stream())
                .collect(Collectors.toSet());

        return UserResponseDTO.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLoginAt(user.getLastLoginAt())

                // profils names
                .profils(
                        userProfils.stream()
                                .map(Profil::getName)
                                .collect(Collectors.toSet())
                )

                // permissions names
                .permissions(
                        allPermissions.stream()
                                .map(Permission::getName)
                                .collect(Collectors.toSet())
                )
                .build();
    }
}