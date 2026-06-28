package wifak.bank.backend.Dtos.Chapter;

import jakarta.validation.constraints.*;

public class ChapterRequestDTO {

    @NotBlank
    @Size(min = 3, max = 150)
    public String title;

    @NotBlank
    @Size(min = 10, max = 5000)
    public String content;

    @NotNull
    @Min(1)
    public Integer chapterOrder;

    @NotNull
    public Long courseId;
}