package wifak.bank.backend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wifak.bank.backend.Dtos.Lesson.LessonRequestDTO;
import wifak.bank.backend.Dtos.Lesson.LessonResponseDTO;
import wifak.bank.backend.Services.LessonService;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @PostMapping("/chapter/{chapterId}")
    public ResponseEntity<LessonResponseDTO> createLesson(
            @PathVariable Long chapterId,
            @RequestBody LessonRequestDTO dto) {

        return ResponseEntity.ok(
                lessonService.createLesson(chapterId, dto)
        );
    }

    @GetMapping("/chapter/{chapterId}")
    public ResponseEntity<List<LessonResponseDTO>> getLessonsByChapter(
            @PathVariable Long chapterId) {

        return ResponseEntity.ok(
                lessonService.getLessonsByChapter(chapterId)
        );
    }

    @GetMapping("/{lessonId}")
    public ResponseEntity<LessonResponseDTO> getLesson(
            @PathVariable Long lessonId) {

        return ResponseEntity.ok(
                lessonService.getLesson(lessonId)
        );
    }

    @PutMapping("/{lessonId}")
    public ResponseEntity<LessonResponseDTO> updateLesson(
            @PathVariable Long lessonId,
            @RequestBody LessonRequestDTO dto) {

        return ResponseEntity.ok(
                lessonService.updateLesson(lessonId, dto)
        );
    }

    @DeleteMapping("/{lessonId}")
    public ResponseEntity<Void> deleteLesson(
            @PathVariable Long lessonId) {

        lessonService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }
}