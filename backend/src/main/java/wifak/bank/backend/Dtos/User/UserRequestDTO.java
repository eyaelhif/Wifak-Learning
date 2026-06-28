package wifak.bank.backend.Dtos.User;

import lombok.Data;

import java.util.List;

@Data
public class UserRequestDTO {

    private String fullName;

    private String email;

    private String password;

    private Boolean active;

    // optionnel lors création / update
    private List<Long> profilIds;
}
