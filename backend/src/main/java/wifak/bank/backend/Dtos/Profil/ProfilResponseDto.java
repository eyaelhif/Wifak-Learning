package wifak.bank.backend.Dtos.Profil;

import lombok.Builder;
import lombok.Data;
import wifak.bank.backend.entities.Permission;
import wifak.bank.backend.entities.Profil;

import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
public class ProfilResponseDto {

    private Long id;

    private String name;

    private Set<String> permissions;

    public static ProfilResponseDto fromEntity(Profil profil) {

        return ProfilResponseDto.builder()
                .id(profil.getId())
                .name(profil.getName())
                .permissions(
                        profil.getPermissions()
                                .stream()
                                .map(Permission::getName)
                                .collect(Collectors.toSet())
                )
                .build();
    }
}