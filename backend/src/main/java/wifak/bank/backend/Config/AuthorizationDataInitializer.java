package wifak.bank.backend.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import wifak.bank.backend.Repositories.PermissionRepository;
import wifak.bank.backend.Repositories.ProfilRepository;
import wifak.bank.backend.Repositories.UserRepository;
import wifak.bank.backend.entities.Permission;
import wifak.bank.backend.entities.Profil;
import wifak.bank.backend.entities.User;
import wifak.bank.backend.entities.enums.RoleType;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuthorizationDataInitializer implements ApplicationRunner {

    private static final String ADMIN_PROFIL_NAME = "ADMIN";

    private static final Map<String, String> DEFAULT_PERMISSIONS = new LinkedHashMap<>();

    static {
        DEFAULT_PERMISSIONS.put("MANAGE_USERS", "Manage users and profiles");
        DEFAULT_PERMISSIONS.put("CREATE_QUIZ", "Create quizzes");
        DEFAULT_PERMISSIONS.put("EDIT_QUIZ", "Edit quizzes");
        DEFAULT_PERMISSIONS.put("DELETE_QUIZ", "Delete quizzes");
        DEFAULT_PERMISSIONS.put("VIEW_STATISTICS", "View statistics and analytics");
        DEFAULT_PERMISSIONS.put("GENERATE_AI_CONTENT", "Generate AI content");
        DEFAULT_PERMISSIONS.put("VALIDATE_CONTENT", "Validate generated content");
    }

    private final PermissionRepository permissionRepository;
    private final ProfilRepository profilRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Set<Permission> adminPermissions = DEFAULT_PERMISSIONS.entrySet()
                .stream()
                .map(entry -> permissionRepository.findByName(entry.getKey())
                        .orElseGet(() -> permissionRepository.save(
                                Permission.builder()
                                        .name(entry.getKey())
                                        .description(entry.getValue())
                                        .build()
                        )))
                .collect(Collectors.toSet());

        Profil adminProfil = profilRepository.findByName(ADMIN_PROFIL_NAME)
                .orElseGet(() -> profilRepository.save(
                        Profil.builder()
                                .name(ADMIN_PROFIL_NAME)
                                .build()
                ));

        adminProfil.getPermissions().addAll(adminPermissions);
        profilRepository.save(adminProfil);

        userRepository.findAll()
                .stream()
                .filter(user -> user.getRole() == RoleType.ADMIN)
                .forEach(user -> assignAdminProfil(user, adminProfil));
    }

    private void assignAdminProfil(User user, Profil adminProfil) {
        boolean alreadyAssigned = user.getProfils()
                .stream()
                .anyMatch(profil -> ADMIN_PROFIL_NAME.equals(profil.getName()));

        if (alreadyAssigned) {
            return;
        }

        user.getProfils().add(adminProfil);
        userRepository.save(user);
    }
}
