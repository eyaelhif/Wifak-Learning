package wifak.bank.backend.Services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import wifak.bank.backend.Repositories.CourseRepository;
import wifak.bank.backend.Repositories.UserRepository;
import wifak.bank.backend.entities.Course;
import wifak.bank.backend.entities.User;

import java.util.List;

@Service
@Transactional
public class CourseService {

    private final CourseRepository courseRepository;
    private final CurrentUserService currentUserService;


    public CourseService(CourseRepository courseRepository,
                         CurrentUserService currentUserService) {
        this.courseRepository = courseRepository;
        this.currentUserService = currentUserService;
    }

    // 🔍 GET ALL
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // 🔍 GET BY ID
    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));
    }

    // 🔍 GET BY CREATOR
    public List<Course> getCoursesByCreator(Long creatorId) {
        return courseRepository.findByCreatorId(creatorId);
    }

    // ✅ CREATE (JWT user = creator)
    public Course createCourse(Course course) {

        User currentUser = currentUserService.getCurrentUser();

        course.setCreator(currentUser);

        return courseRepository.save(course);
    }

    // ✏️ UPDATE (admin OR creator only)
    public Course updateCourse(Long id, Course updated) {

        Course existing = getCourseById(id);

        User currentUser = currentUserService.getCurrentUser();

        // 🔐 RBAC + ownership check
        assertAdminOrCreator(currentUser, existing);

        existing.setTitle(updated.getTitle());
        existing.setDescription(updated.getDescription());
        existing.setImage(updated.getImage());
        existing.setCategory(updated.getCategory());
        existing.setStars(updated.getStars());

        // ❌ NEVER change creator
        // existing.setCreator(...);

        return courseRepository.save(existing);
    }

    public List<Course> getMyCourses() {
        User currentUser = currentUserService.getCurrentUser();
        return courseRepository.findByCreatorId(currentUser.getId());
    }


    // ❌ DELETE (admin OR creator only)
    public void deleteCourse(Long id) {

        Course course = getCourseById(id);

        User currentUser = currentUserService.getCurrentUser();

        // 🔐 security check
        assertAdminOrCreator(currentUser, course);

        courseRepository.delete(course);
    }

    // 🔐 SECURITY METHOD
    private void assertAdminOrCreator(User currentUser, Course course) {

        // ADMIN → always allowed
        if (currentUser.getRole().name().equals("ADMIN")) return;

        // CREATOR → allowed
        if (course.getCreator().getId().equals(currentUser.getId())) return;

        // otherwise → forbidden
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden");
    }
}