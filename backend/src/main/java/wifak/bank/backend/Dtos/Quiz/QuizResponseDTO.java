package wifak.bank.backend.Dtos.Quiz;

import wifak.bank.backend.entities.AnswerOption;
import wifak.bank.backend.entities.Question;
import wifak.bank.backend.entities.Quiz;

import java.time.LocalDateTime;
import java.util.List;

public class QuizResponseDTO {
    public Long id;
    public String title;
    public String description;
    public Integer passingScore;
    public Integer timeLimitMinutes;
    public Boolean active;
    public Long courseId;
    public String courseTitle;
    public LocalDateTime createdAt;
    public List<QuestionDTO> questions;

    public static QuizResponseDTO fromEntity(Quiz quiz) {
        QuizResponseDTO dto = new QuizResponseDTO();
        dto.id = quiz.getId();
        dto.title = quiz.getTitle();
        dto.description = quiz.getDescription();
        dto.passingScore = quiz.getPassingScore();
        dto.timeLimitMinutes = quiz.getTimeLimitMinutes();
        dto.active = quiz.getActive();
        dto.courseId = quiz.getCourse().getId();
        dto.courseTitle = quiz.getCourse().getTitle();
        dto.createdAt = quiz.getCreatedAt();
        dto.questions = quiz.getQuestions().stream()
                .sorted((a, b) -> Integer.compare(
                        a.getOrderIndex() == null ? 0 : a.getOrderIndex(),
                        b.getOrderIndex() == null ? 0 : b.getOrderIndex()))
                .map(QuizResponseDTO::questionFromEntity)
                .toList();
        return dto;
    }

    private static QuestionDTO questionFromEntity(Question question) {
        QuestionDTO dto = new QuestionDTO();
        dto.id = question.getId();
        dto.text = question.getText();
        dto.type = question.getType();
        dto.points = question.getPoints();
        dto.orderIndex = question.getOrderIndex();
        dto.options = question.getOptions().stream().map(QuizResponseDTO::optionFromEntity).toList();
        return dto;
    }

    private static AnswerOptionDTO optionFromEntity(AnswerOption option) {
        AnswerOptionDTO dto = new AnswerOptionDTO();
        dto.id = option.getId();
        dto.text = option.getText();
        dto.correct = option.getCorrect();
        return dto;
    }
}
