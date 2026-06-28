package wifak.bank.backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import wifak.bank.backend.entities.Lesson;

import java.util.List;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    List<Lesson> findByChapterIdOrderByOrderIndexAsc(Long chapterId);

}