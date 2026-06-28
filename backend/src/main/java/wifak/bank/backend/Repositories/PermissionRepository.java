package wifak.bank.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wifak.bank.backend.entities.Permission;

import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByName(String name);
    boolean existsByName(String name);
}
