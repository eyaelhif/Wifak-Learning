package wifak.bank.backend.Services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wifak.bank.backend.Repositories.ChapterRepository;
import wifak.bank.backend.Repositories.CourseRepository;
import wifak.bank.backend.entities.Chapter;
import wifak.bank.backend.entities.Course;

import java.util.List;

@Service
@Transactional
public class ChapterService {

    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;

    public ChapterService(ChapterRepository chapterRepository, CourseRepository courseRepository) {
        this.chapterRepository = chapterRepository;
        this.courseRepository = courseRepository;
    }

    public List<Chapter> getAllChapters() {
        return chapterRepository.findAll();
    }

    public Chapter getById(Long id) {
        return chapterRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Chapter not found with id: " + id));
    }

    public List<Chapter> getByCourse(Long courseId) {
        return chapterRepository.findByCourseIdOrderByChapterOrderAsc(courseId);
    }

    public Chapter create(Chapter chapter, Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));
        chapter.setCourse(course);
        return chapterRepository.save(chapter);
    }

    public Chapter update(Long id, Chapter updated, Long courseId) {
        Chapter existing = getById(id);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));

        existing.setTitle(updated.getTitle());
        existing.setContent(updated.getContent());
        existing.setChapterOrder(updated.getChapterOrder());
        existing.setCourse(course);

        return chapterRepository.save(existing);
    }

    public void delete(Long id) {
        chapterRepository.delete(getById(id));
    }
}