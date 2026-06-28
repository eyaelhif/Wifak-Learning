package wifak.bank.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wifak.bank.backend.entities.Enrollment;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    List<Enrollment> findByCourseId(Long courseId);
}