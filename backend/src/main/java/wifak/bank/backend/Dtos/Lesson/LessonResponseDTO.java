package wifak.bank.backend.Dtos.Lesson;

import java.time.Instant;

public record LessonResponseDTO(

        Long id,
        String title,
        String description,
        Integer orderIndex,
        Integer durationMinutes,
        Boolean published,
        Long chapterId,
        Instant createdAt,
        Instant updatedAt

) {}