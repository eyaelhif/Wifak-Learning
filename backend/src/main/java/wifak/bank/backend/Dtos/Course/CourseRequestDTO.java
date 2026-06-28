package wifak.bank.backend.Dtos.Course;

import jakarta.validation.constraints.*;
import wifak.bank.backend.entities.enums.CourseCategory;

public class CourseRequestDTO {

    @NotBlank
    @Size(min = 3, max = 150)
    public String title;

    @NotBlank
    @Size(min = 10, max = 3000)
    public String description;

    @Size(max = 500)
    public String image;

    @NotNull
    public CourseCategory category;

    @NotNull
    @DecimalMin("0.0")
    @DecimalMax("5.0")
    public Double stars = 0.0;

    @NotNull
    public Long creatorId;
}