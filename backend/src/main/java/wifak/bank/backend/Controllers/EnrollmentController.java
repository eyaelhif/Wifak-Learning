package wifak.bank.backend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import wifak.bank.backend.Dtos.Enrollment.EnrollmentRequestDTO;
import wifak.bank.backend.Dtos.Enrollment.EnrollmentResponseDTO;
import wifak.bank.backend.Dtos.Enrollment.EnrollmentUpdateDTO;
import wifak.bank.backend.Services.EnrollmentService;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> create(@RequestBody EnrollmentRequestDTO dto) {
        return ResponseEntity.ok(enrollmentService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<EnrollmentResponseDTO>> getAll() {
        return ResponseEntity.ok(enrollmentService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnrollmentResponseDTO> update(@PathVariable Long id,
                                                        @RequestBody EnrollmentUpdateDTO dto) {
        return ResponseEntity.ok(enrollmentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        enrollmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // extra filters
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<EnrollmentResponseDTO>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.getByUser(userId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<EnrollmentResponseDTO>> getByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getByCourse(courseId));
    }
}