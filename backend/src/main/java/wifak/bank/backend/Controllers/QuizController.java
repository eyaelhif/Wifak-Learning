package wifak.bank.backend.Controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wifak.bank.backend.Dtos.Quiz.QuizRequestDTO;
import wifak.bank.backend.Dtos.Quiz.QuizResponseDTO;
import wifak.bank.backend.Services.QuizService;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping
    public List<QuizResponseDTO> getAll() {
        return quizService.getAll().stream().map(QuizResponseDTO::fromEntity).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuizResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(QuizResponseDTO.fromEntity(quizService.getById(id)));
    }

    @GetMapping("/course/{courseId}")
    public List<QuizResponseDTO> getByCourse(@PathVariable Long courseId) {
        return quizService.getByCourse(courseId).stream().map(QuizResponseDTO::fromEntity).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuizResponseDTO create(@Valid @RequestBody QuizRequestDTO dto) {
        return QuizResponseDTO.fromEntity(quizService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizResponseDTO> update(@PathVariable Long id, @Valid @RequestBody QuizRequestDTO dto) {
        return ResponseEntity.ok(QuizResponseDTO.fromEntity(quizService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        quizService.delete(id);
    }
}
