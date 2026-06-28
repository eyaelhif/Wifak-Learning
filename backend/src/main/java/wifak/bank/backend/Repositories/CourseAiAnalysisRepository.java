package wifak.bank.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wifak.bank.backend.entities.CourseAiAnalysis;

import java.util.Optional;

public interface CourseAiAnalysisRepository extends JpaRepository<CourseAiAnalysis, Long> {
    Optional<CourseAiAnalysis> findByCourseId(Long courseId);
}
