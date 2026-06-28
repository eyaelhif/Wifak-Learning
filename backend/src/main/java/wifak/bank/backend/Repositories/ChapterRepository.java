package wifak.bank.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wifak.bank.backend.entities.Chapter;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByCourseIdOrderByChapterOrderAsc(Long courseId);
}