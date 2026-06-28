package wifak.bank.backend.Services;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wifak.bank.backend.Repositories.ProfilRepository;
import wifak.bank.backend.Repositories.UserRepository;
import wifak.bank.backend.entities.Profil;
import wifak.bank.backend.entities.User;
import wifak.bank.backend.Exceptions.UserNotFoundException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProfilRepository profilRepository;
    private final PasswordEncoder passwordEncoder;

    // =========================
    // GET ALL USERS
    // =========================
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // =========================
    // GET USER BY ID
    // =========================
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found with id: " + id));
    }

    // =========================
    // CREATE USER
    // =========================
    public User createUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        user.setPasswordHash(
                passwordEncoder.encode(user.getPasswordHash())
        );

        return userRepository.save(user);
    }

    // =========================
    // UPDATE USER
    // =========================
    public User updateUser(Long id, User updatedUser) {

        User existingUser = getUserById(id);

        if (!existingUser.getEmail().equals(updatedUser.getEmail())
                && userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setFullName(updatedUser.getFullName());
        existingUser.setActive(updatedUser.getActive());
        existingUser.setLastLoginAt(updatedUser.getLastLoginAt());

        return userRepository.save(existingUser);
    }

    // =========================
    // ASSIGN PROFILS TO USER
    // =========================
    public void updateUserProfils(Long userId, List<Long> profilIds) {

        User user = getUserById(userId);

        Set<Profil> profils = new HashSet<>(
                profilRepository.findAllById(profilIds)
        );

        user.setProfils(profils);

        userRepository.save(user);
    }

    // =========================
    // DELETE USER
    // =========================
    public void deleteUser(Long id) {
        User user = getUserById(id);
        userRepository.delete(user);
    }

    // =========================
    // DEACTIVATE USER
    // =========================
    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    // =========================
    // GET USER BY EMAIL
    // =========================
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));
    }
}