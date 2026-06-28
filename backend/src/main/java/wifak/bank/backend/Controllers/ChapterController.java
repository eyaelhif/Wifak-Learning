package wifak.bank.backend.Controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wifak.bank.backend.Dtos.Chapter.ChapterRequestDTO;
import wifak.bank.backend.Dtos.Chapter.ChapterResponseDTO;
import wifak.bank.backend.Services.ChapterService;
import wifak.bank.backend.entities.Chapter;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chapters")
public class ChapterController {

    private final ChapterService chapterService;

    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    @GetMapping
    public List<ChapterResponseDTO> getAll() {
        return chapterService.getAllChapters().stream()
                .map(ChapterResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChapterResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ChapterResponseDTO.fromEntity(chapterService.getById(id)));
    }

    @GetMapping("/course/{courseId}")
    public List<ChapterResponseDTO> getByCourse(@PathVariable Long courseId) {
        return chapterService.getByCourse(courseId).stream()
                .map(ChapterResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ChapterResponseDTO create(@Valid @RequestBody ChapterRequestDTO dto) {
        Chapter ch = new Chapter();
        ch.setTitle(dto.title);
        ch.setContent(dto.content);
        ch.setChapterOrder(dto.chapterOrder);

        return ChapterResponseDTO.fromEntity(chapterService.create(ch, dto.courseId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChapterResponseDTO> update(@PathVariable Long id, @Valid @RequestBody ChapterRequestDTO dto) {
        Chapter ch = new Chapter();
        ch.setTitle(dto.title);
        ch.setContent(dto.content);
        ch.setChapterOrder(dto.chapterOrder);

        return ResponseEntity.ok(
                ChapterResponseDTO.fromEntity(chapterService.update(id, ch, dto.courseId))
        );
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        chapterService.delete(id);
    }
}