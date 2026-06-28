package wifak.bank.backend.Repositories;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import wifak.bank.backend.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = {"profils", "profils.permissions", "courses"})
    List<User> findAll();

    @EntityGraph(attributePaths = {"profils", "profils.permissions", "courses"})
    Optional<User> findById(Long id);

    @EntityGraph(attributePaths = {"profils", "profils.permissions", "courses"})
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}