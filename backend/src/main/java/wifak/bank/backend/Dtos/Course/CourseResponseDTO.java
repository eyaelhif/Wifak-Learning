package wifak.bank.backend.Dtos.Course;

import wifak.bank.backend.entities.Course;
import wifak.bank.backend.entities.enums.CourseCategory;

import java.time.LocalDateTime;

public class CourseResponseDTO {
    public Long id;
    public String title;
    public String description;
    public String image;
    public CourseCategory category;
    public LocalDateTime createdAt;
    public Double stars;

    public Long creatorId;
    public String creatorFullName;
    public String creatorEmail;

    public static CourseResponseDTO fromEntity(Course c) {
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.id = c.getId();
        dto.title = c.getTitle();
        dto.description = c.getDescription();
        dto.image = c.getImage();
        dto.category = c.getCategory();
        dto.createdAt = c.getCreatedAt();
        dto.stars = c.getStars();

        dto.creatorId = c.getCreator().getId();
        dto.creatorFullName = c.getCreator().getFullName();
        dto.creatorEmail = c.getCreator().getEmail();
        return dto;
    }
}