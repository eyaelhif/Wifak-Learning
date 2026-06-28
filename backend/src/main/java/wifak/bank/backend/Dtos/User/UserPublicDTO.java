package wifak.bank.backend.Dtos.User;

import wifak.bank.backend.entities.User;

public class UserPublicDTO {
    private Long id;
    private String fullName;
    private String email; // ou autre info publique

    // Constructeur
    public UserPublicDTO(Long id, String fullName, String email) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
    }

    // Getter/Setter
    public Long getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }

    // Méthode fromEntity pour convertir User -> UserPublicDTO
    public static UserPublicDTO fromEntity(User user) {
        return new UserPublicDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail() // seulement les champs publics
        );
    }
}