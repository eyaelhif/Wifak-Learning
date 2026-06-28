package wifak.bank.backend.Dtos.CourseAi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import wifak.bank.backend.entities.CourseAiAnalysis;

import java.time.LocalDateTime;

public class CourseAiAnalysisResponseDTO {
    public Long id;
    public Long courseId;
    public String pythonCourseId;
    public String status;
    public String title;
    public String language;
    public Double confidence;
    public String shortSummary;
    public String detailedSummary;
    public Boolean vectorIndexed;
    public JsonNode analysis;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public static CourseAiAnalysisResponseDTO fromEntity(CourseAiAnalysis entity, ObjectMapper objectMapper) {
        CourseAiAnalysisResponseDTO dto = new CourseAiAnalysisResponseDTO();
        dto.id = entity.getId();
        dto.courseId = entity.getCourse().getId();
        dto.pythonCourseId = entity.getPythonCourseId();
        dto.status = entity.getStatus();
        dto.title = entity.getTitle();
        dto.language = entity.getLanguage();
        dto.confidence = entity.getConfidence();
        dto.shortSummary = entity.getShortSummary();
        dto.detailedSummary = entity.getDetailedSummary();
        dto.vectorIndexed = entity.getVectorIndexed();
        dto.createdAt = entity.getCreatedAt();
        dto.updatedAt = entity.getUpdatedAt();
        try {
            dto.analysis = objectMapper.readTree(entity.getAnalysisJson());
        } catch (Exception ignored) {
            dto.analysis = objectMapper.createObjectNode();
        }
        return dto;
    }
}
