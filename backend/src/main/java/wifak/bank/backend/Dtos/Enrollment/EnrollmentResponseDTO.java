package wifak.bank.backend.Dtos.Enrollment;

import java.time.LocalDateTime;

public record EnrollmentResponseDTO(
        Long id,
        Long userId,
        Long courseId,
        LocalDateTime enrolledAt,
        Integer progress,
        Integer timeSpentMinutes
) {}