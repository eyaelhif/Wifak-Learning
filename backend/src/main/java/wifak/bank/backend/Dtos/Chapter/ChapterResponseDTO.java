package wifak.bank.backend.Dtos.Chapter;

import wifak.bank.backend.entities.Chapter;

import java.time.LocalDateTime;

public class ChapterResponseDTO {
    public Long id;
    public String title;
    public String content;
    public Integer chapterOrder;
    public LocalDateTime createdAt;

    public Long courseId;
    public String courseTitle;

    public static ChapterResponseDTO fromEntity(Chapter ch) {
        ChapterResponseDTO dto = new ChapterResponseDTO();
        dto.id = ch.getId();
        dto.title = ch.getTitle();
        dto.content = ch.getContent();
        dto.chapterOrder = ch.getChapterOrder();
        dto.createdAt = ch.getCreatedAt();
        dto.courseId = ch.getCourse().getId();
        dto.courseTitle = ch.getCourse().getTitle();
        return dto;
    }
}