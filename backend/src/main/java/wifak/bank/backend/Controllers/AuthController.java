package wifak.bank.backend.Controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import wifak.bank.backend.Dtos.Auth.AuthResponseDTO;
import wifak.bank.backend.Dtos.Auth.LoginRequestDTO;
import wifak.bank.backend.Dtos.Auth.RegisterRequestDTO;
import wifak.bank.backend.Dtos.User.UserResponseDTO;
import wifak.bank.backend.entities.User;
import wifak.bank.backend.entities.enums.RoleType;
import wifak.bank.backend.Repositories.UserRepository;
import wifak.bank.backend.Security.JwtService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public AuthResponseDTO register(@Valid @RequestBody RegisterRequestDTO dto) {

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setRole(dto.getRole() != null ? dto.getRole() : RoleType.COLLABORATEUR);
        user.setActive(true);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponseDTO(token, UserResponseDTO.fromEntity(user));
    }

    @PostMapping("/login")
    public AuthResponseDTO login(@RequestBody LoginRequestDTO dto) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        dto.getEmail(),
                        dto.getPassword()
                )
        );

        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponseDTO(token, UserResponseDTO.fromEntity(user));
    }

    @GetMapping("/test")
    public String test() {
        return "OK";
    }

}
