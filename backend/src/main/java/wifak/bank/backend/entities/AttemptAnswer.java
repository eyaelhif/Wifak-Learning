package wifak.bank.backend.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "attempt_answers")
public class AttemptAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_option_id", nullable = false)
    private AnswerOption selectedOption;

    public Long getId() {
        return id;
    }

    public QuizAttempt getAttempt() {
        return attempt;
    }

    public Question getQuestion() {
        return question;
    }

    public AnswerOption getSelectedOption() {
        return selectedOption;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAttempt(QuizAttempt attempt) {
        this.attempt = attempt;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public void setSelectedOption(AnswerOption selectedOption) {
        this.selectedOption = selectedOption;
    }
}