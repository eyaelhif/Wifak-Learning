package wifak.bank.backend.Dtos.Quiz;

import wifak.bank.backend.entities.enums.QuestionType;

import java.util.ArrayList;
import java.util.List;

public class QuestionDTO {
    public Long id;
    public String text;
    public QuestionType type = QuestionType.SINGLE_CHOICE;
    public Integer points = 1;
    public Integer orderIndex;
    public List<AnswerOptionDTO> options = new ArrayList<>();
}
