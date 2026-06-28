package wifak.bank.backend.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "enrollments",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "course_id"})
        }
)
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // utilisateur inscrit
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // cours suivi
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    // date d'inscription
    @Column(nullable = false)
    private LocalDateTime enrolledAt;

    // progression du cours (0 - 100)
    @Column(nullable = false)
    private Integer progress;

    // temps total passé dans le cours (en minutes)
    @Column(nullable = false)
    private Integer timeSpentMinutes;

    public Enrollment() {
        this.enrolledAt = LocalDateTime.now();
        this.progress = 0;
        this.timeSpentMinutes = 0;
    }

    // getters et setters

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Course getCourse() {
        return course;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public Integer getProgress() {
        return progress;
    }

    public Integer getTimeSpentMinutes() {
        return timeSpentMinutes;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public void setTimeSpentMinutes(Integer timeSpentMinutes) {
        this.timeSpentMinutes = timeSpentMinutes;
    }
}