package wifak.bank.backend.Dtos.Enrollment;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record EnrollmentUpdateDTO(
        @Min(0)
        @Max(100)
        Integer progress,
        @Min(0)
        Integer timeSpentMinutes
) {}