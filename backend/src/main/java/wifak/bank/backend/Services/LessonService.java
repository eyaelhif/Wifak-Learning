package wifak.bank.backend.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wifak.bank.backend.Dtos.Lesson.LessonRequestDTO;
import wifak.bank.backend.Dtos.Lesson.LessonResponseDTO;
import wifak.bank.backend.entities.Chapter;
import wifak.bank.backend.entities.Lesson;
import wifak.bank.backend.Repositories.ChapterRepository;
import wifak.bank.backend.Repositories.LessonRepository;

import java.util.List;

@Service
@Transactional
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;
    @Autowired
    private ChapterRepository chapterRepository;

    public LessonResponseDTO createLesson(Long chapterId, LessonRequestDTO dto) {

        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        Lesson lesson = new Lesson();

        lesson.setTitle(dto.title());
        lesson.setDescription(dto.description());
        lesson.setOrderIndex(dto.orderIndex());
        lesson.setDurationMinutes(dto.durationMinutes());
        lesson.setPublished(dto.published() != null && dto.published());
        lesson.setChapter(chapter);

        lessonRepository.save(lesson);
        return mapToDTO(lesson);
    }

    @Transactional(readOnly = true)
    public List<LessonResponseDTO> getLessonsByChapter(Long chapterId) {
        return lessonRepository.findByChapterIdOrderByOrderIndexAsc(chapterId)
                .stream()
                .map(this::mapToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public LessonResponseDTO getLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));
        return mapToDTO(lesson);
    }

    public LessonResponseDTO updateLesson(Long lessonId, LessonRequestDTO dto) {

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        // update fields (only if provided)
        if (dto.title() != null) lesson.setTitle(dto.title());
        if (dto.description() != null) lesson.setDescription(dto.description());
        if (dto.orderIndex() != null) lesson.setOrderIndex(dto.orderIndex());
        if (dto.durationMinutes() != null) lesson.setDurationMinutes(dto.durationMinutes());
        if (dto.published() != null) lesson.setPublished(dto.published());

        lessonRepository.save(lesson);
        return mapToDTO(lesson);
    }

    public void deleteLesson(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new RuntimeException("Lesson not found");
        }
        lessonRepository.deleteById(lessonId);
    }

    private LessonResponseDTO mapToDTO(Lesson lesson) {
        return new LessonResponseDTO(
                lesson.getId(),
                lesson.getTitle(),
                lesson.getDescription(),
                lesson.getOrderIndex(),
                lesson.getDurationMinutes(),
                lesson.getPublished(),
                lesson.getChapter().getId(),
                lesson.getCreatedAt(),
                lesson.getUpdatedAt()
        );
    }
}