package wifak.bank.backend.entities;

import jakarta.persistence.*;
import wifak.bank.backend.entities.enums.QuestionType;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType type;

    @Column(nullable = false)
    private Integer points = 1;

    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnswerOption> options = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public QuestionType getType() {
        return type;
    }

    public Integer getPoints() {
        return points;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public List<AnswerOption> getOptions() {
        return options;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setText(String text) {
        this.text = text;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public void setOptions(List<AnswerOption> options) {
        this.options = options;
    }
}