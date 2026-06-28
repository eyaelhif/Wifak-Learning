package wifak.bank.backend.Services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import wifak.bank.backend.Dtos.Enrollment.EnrollmentRequestDTO;
import wifak.bank.backend.Dtos.Enrollment.EnrollmentResponseDTO;
import wifak.bank.backend.Dtos.Enrollment.EnrollmentUpdateDTO;
import wifak.bank.backend.entities.Course;
import wifak.bank.backend.entities.Enrollment;
import wifak.bank.backend.entities.User;
import wifak.bank.backend.Repositories.CourseRepository;
import wifak.bank.backend.Repositories.EnrollmentRepository;
import wifak.bank.backend.Repositories.UserRepository;

import java.util.List;

@Service
@Transactional
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             UserRepository userRepository,
                             CourseRepository courseRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public EnrollmentResponseDTO create(EnrollmentRequestDTO dto) {

        User user = userRepository.findById(dto.userId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Course course = courseRepository.findById(dto.courseId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        Enrollment enrollment = new Enrollment();
        enrollment.setUser(user);
        enrollment.setCourse(course);

        enrollmentRepository.save(enrollment);
        return toDTO(enrollment);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getAll() {
        return enrollmentRepository.findAll().stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public EnrollmentResponseDTO getById(Long id) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment not found"));
        return toDTO(enrollment);
    }

    public EnrollmentResponseDTO update(Long id, EnrollmentUpdateDTO dto) {
        Enrollment enrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment not found"));

        if (dto.progress() != null) {
            if (dto.progress() < 0 || dto.progress() > 100) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Progress must be between 0 and 100");
            }
            enrollment.setProgress(dto.progress());
        }

        if (dto.timeSpentMinutes() != null) {
            if (dto.timeSpentMinutes() < 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "timeSpentMinutes must be >= 0");
            }
            enrollment.setTimeSpentMinutes(dto.timeSpentMinutes());
        }

        enrollmentRepository.save(enrollment);
        return toDTO(enrollment);
    }

    public void delete(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Enrollment not found");
        }
        enrollmentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getByUser(Long userId) {
        return enrollmentRepository.findByUserId(userId).stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<EnrollmentResponseDTO> getByCourse(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream().map(this::toDTO).toList();
    }

    private EnrollmentResponseDTO toDTO(Enrollment e) {
        return new EnrollmentResponseDTO(
                e.getId(),
                e.getUser().getId(),
                e.getCourse().getId(),
                e.getEnrolledAt(),
                e.getProgress(),
                e.getTimeSpentMinutes()
        );
    }
}