package wifak.bank.backend.Controllers;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import wifak.bank.backend.Dtos.Course.CourseRequestDTO;
import wifak.bank.backend.Dtos.Course.CourseResponseDTO;
import wifak.bank.backend.Services.CourseService;
import wifak.bank.backend.entities.Course;
import wifak.bank.backend.entities.User;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // 🔍 GET ALL
    @GetMapping
    public List<CourseResponseDTO> getAllCourses() {
        return courseService.getAllCourses().stream()
                .map(CourseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 🔍 GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(
                CourseResponseDTO.fromEntity(courseService.getCourseById(id))
        );
    }

    // 🔍 GET BY CREATOR (optionnel, OK de garder)
    @GetMapping("/creator/{creatorId}")
    public List<CourseResponseDTO> getByCreator(@PathVariable Long creatorId) {
        return courseService.getCoursesByCreator(creatorId).stream()
                .map(CourseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // ✅ CREATE (creator = JWT user)
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponseDTO createCourse(@Valid @RequestBody CourseRequestDTO dto) {

        Course c = new Course();
        c.setTitle(dto.title);
        c.setDescription(dto.description);
        c.setImage(dto.image);
        c.setCategory(dto.category);
        c.setStars(dto.stars);

        return CourseResponseDTO.fromEntity(
                courseService.createCourse(c) // ✅ no creatorId
        );
    }

    // ✏️ UPDATE (admin OR creator only)
    @PutMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> updateCourse(
            @PathVariable Long id,
            @Valid @RequestBody CourseRequestDTO dto
    ) {

        Course c = new Course();
        c.setTitle(dto.title);
        c.setDescription(dto.description);
        c.setImage(dto.image);
        c.setCategory(dto.category);
        c.setStars(dto.stars);

        return ResponseEntity.ok(
                CourseResponseDTO.fromEntity(
                        courseService.updateCourse(id, c) // ✅ no creatorId
                )
        );
    }

    // ❌ DELETE (admin OR creator only)
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
    }

    @GetMapping("/myCourses")
    public List<CourseResponseDTO> getMyCourses() {
        return courseService.getMyCourses().stream()
                .map(CourseResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }
}