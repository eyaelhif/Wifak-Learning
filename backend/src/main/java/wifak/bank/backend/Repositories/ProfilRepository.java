package wifak.bank.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import wifak.bank.backend.entities.Profil;

import java.util.Optional;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {

    Optional<Profil> findByName(String name);

    boolean existsByName(String name);
}
