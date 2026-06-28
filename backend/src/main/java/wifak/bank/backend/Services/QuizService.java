package wifak.bank.backend.Services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import wifak.bank.backend.Dtos.Quiz.AnswerOptionDTO;
import wifak.bank.backend.Dtos.Quiz.QuestionDTO;
import wifak.bank.backend.Dtos.Quiz.QuizRequestDTO;
import wifak.bank.backend.Repositories.CourseRepository;
import wifak.bank.backend.Repositories.QuizRepository;
import wifak.bank.backend.entities.AnswerOption;
import wifak.bank.backend.entities.Course;
import wifak.bank.backend.entities.Question;
import wifak.bank.backend.entities.Quiz;

import java.util.List;

@Service
@Transactional
public class QuizService {
    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;

    public QuizService(QuizRepository quizRepository, CourseRepository courseRepository) {
        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
    }

    public List<Quiz> getAll() {
        return quizRepository.findAll();
    }

    public Quiz getById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Quiz not found"));
    }

    public List<Quiz> getByCourse(Long courseId) {
        return quizRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
    }

    public Quiz create(QuizRequestDTO dto) {
        Quiz quiz = new Quiz();
        applyDto(quiz, dto);
        return quizRepository.save(quiz);
    }

    public Quiz update(Long id, QuizRequestDTO dto) {
        Quiz quiz = getById(id);
        quiz.getQuestions().clear();
        applyDto(quiz, dto);
        return quizRepository.save(quiz);
    }

    public void delete(Long id) {
        quizRepository.delete(getById(id));
    }

    private void applyDto(Quiz quiz, QuizRequestDTO dto) {
        Course course = courseRepository.findById(dto.courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Course not found"));

        quiz.setTitle(dto.title);
        quiz.setDescription(dto.description);
        quiz.setPassingScore(dto.passingScore == null ? 50 : dto.passingScore);
        quiz.setTimeLimitMinutes(dto.timeLimitMinutes);
        quiz.setActive(dto.active == null || dto.active);
        quiz.setCourse(course);

        if (dto.questions == null) {
            return;
        }

        int index = 1;
        for (QuestionDTO questionDto : dto.questions) {
            Question question = new Question();
            question.setText(questionDto.text);
            question.setType(questionDto.type);
            question.setPoints(questionDto.points == null ? 1 : questionDto.points);
            question.setOrderIndex(questionDto.orderIndex == null ? index : questionDto.orderIndex);
            question.setQuiz(quiz);

            if (questionDto.options != null) {
                for (AnswerOptionDTO optionDto : questionDto.options) {
                    AnswerOption option = new AnswerOption();
                    option.setText(optionDto.text);
                    option.setCorrect(Boolean.TRUE.equals(optionDto.correct));
                    option.setQuestion(question);
                    question.getOptions().add(option);
                }
            }

            quiz.getQuestions().add(question);
            index++;
        }
    }
}
