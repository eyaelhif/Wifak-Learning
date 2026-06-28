package wifak.bank.backend.Dtos.Quiz;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class QuizRequestDTO {
    @NotBlank
    public String title;

    public String description;

    @NotNull
    public Long courseId;

    public Integer passingScore = 50;
    public Integer timeLimitMinutes;
    public Boolean active = true;

    @Valid
    public List<QuestionDTO> questions = new ArrayList<>();
}
