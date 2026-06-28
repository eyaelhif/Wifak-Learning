package wifak.bank.backend.Controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import wifak.bank.backend.Dtos.User.UserRequestDTO;
import wifak.bank.backend.Dtos.User.UserResponseDTO;
import wifak.bank.backend.Services.UserService;
import wifak.bank.backend.entities.User;
import wifak.bank.backend.entities.enums.RoleType;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================
    // GET ALL USERS (ADMIN)
    // =========================
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public List<UserResponseDTO> getAllUsersAdmin() {

        return userService.getAllUsers()
                .stream()
                .map(UserResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // =========================
    // GET ALL USERS (PUBLIC)
    // =========================
    @GetMapping
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public List<UserResponseDTO> getAllUsersPublic() {

        return userService.getAllUsers()
                .stream()
                .map(UserResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // =========================
    // GET USER BY ID
    // =========================
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id);

        return ResponseEntity.ok(
                UserResponseDTO.fromEntity(user)
        );
    }

    // =========================
    // CREATE USER
    // =========================
    @PostMapping("/addUser")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO createUser(@RequestBody UserRequestDTO request) {

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword());
        user.setRole(RoleType.COLLABORATEUR);
        user.setActive(request.getActive() != null ? request.getActive() : true);

        User createdUser = userService.createUser(user);

        if (request.getProfilIds() != null) {
            userService.updateUserProfils(createdUser.getId(), request.getProfilIds());
            createdUser = userService.getUserById(createdUser.getId());
        }

        return UserResponseDTO.fromEntity(createdUser);
    }

    // =========================
    // UPDATE USER
    // =========================
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UserRequestDTO request
    ) {

        User updatedUser = new User();
        updatedUser.setFullName(request.getFullName());
        updatedUser.setEmail(request.getEmail());
        updatedUser.setActive(request.getActive() != null ? request.getActive() : true);

        User user = userService.updateUser(id, updatedUser);

        if (request.getProfilIds() != null) {
            userService.updateUserProfils(id, request.getProfilIds());
            user = userService.getUserById(id);
        }

        return ResponseEntity.ok(UserResponseDTO.fromEntity(user));
    }

    // =========================
    // DELETE USER
    // =========================
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUser(@PathVariable Long id) {

        userService.deleteUser(id);
    }

    // =========================
    // DEACTIVATE USER
    // =========================
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateUser(@PathVariable Long id) {

        userService.deactivateUser(id);
    }

    // =========================
    // CURRENT USER PROFILE
    // =========================
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDTO> getMyProfile(Authentication authentication) {

        String email = authentication.getName();

        User user = userService.getUserByEmail(email);

        return ResponseEntity.ok(
                UserResponseDTO.fromEntity(user)
        );
    }

    // =========================
    // ASSIGN PROFILS TO USER (NEW RBAC)
    // =========================
    @PutMapping("/{id}/profils")
    @PreAuthorize("hasAuthority('MANAGE_USERS')")
    public ResponseEntity<Void> updateUserProfils(
            @PathVariable Long id,
            @RequestBody List<Long> profilIds
    ) {

        userService.updateUserProfils(id, profilIds);

        return ResponseEntity.ok().build();
    }
}
