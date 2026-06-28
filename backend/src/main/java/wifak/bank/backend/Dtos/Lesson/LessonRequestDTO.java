package wifak.bank.backend.Dtos.Lesson;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LessonRequestDTO(
        @NotBlank
        String title,
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100)
        String description,
        @NotBlank
        Integer orderIndex,
        @NotBlank
        Integer durationMinutes,
        @NotBlank
        Boolean published

) {}