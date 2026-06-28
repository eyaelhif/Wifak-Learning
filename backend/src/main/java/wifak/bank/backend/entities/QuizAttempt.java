package wifak.bank.backend.entities;

import jakarta.persistence.*;
import wifak.bank.backend.entities.enums.AttemptStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
public class QuizAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttemptStatus status;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime submittedAt;

    private Double score;

    private Boolean passed;

    @OneToMany(mappedBy = "attempt", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AttemptAnswer> answers = new ArrayList<>();

    public QuizAttempt() {
        this.startedAt = LocalDateTime.now();
        this.status = AttemptStatus.IN_PROGRESS;
        this.score = 0.0;
        this.passed = false;
    }

    public Long getId() {
        return id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public User getUser() {
        return user;
    }

    public AttemptStatus getStatus() {
        return status;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public Double getScore() {
        return score;
    }

    public Boolean getPassed() {
        return passed;
    }

    public List<AttemptAnswer> getAnswers() {
        return answers;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setStatus(AttemptStatus status) {
        this.status = status;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public void setPassed(Boolean passed) {
        this.passed = passed;
    }

    public void setAnswers(List<AttemptAnswer> answers) {
        this.answers = answers;
    }
}