package wifak.bank.backend.Dtos.User;

import wifak.bank.backend.entities.Course;
import wifak.bank.backend.entities.enums.CourseCategory;

import java.time.LocalDateTime;

public class UserCourseDTO {
    private Long id;
    private String title;
    private String description;
    private String image;
    private CourseCategory category;
    private LocalDateTime createdAt;
    private Double stars;

    public static UserCourseDTO fromEntity(Course course) {
        UserCourseDTO dto = new UserCourseDTO();
        dto.id = course.getId();
        dto.title = course.getTitle();
        dto.description = course.getDescription();
        dto.image = course.getImage();
        dto.category = course.getCategory();
        dto.createdAt = course.getCreatedAt();
        dto.stars = course.getStars();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public CourseCategory getCategory() {
        return category;
    }

    public void setCategory(CourseCategory category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getStars() {
        return stars;
    }

    public void setStars(Double stars) {
        this.stars = stars;
    }
}
