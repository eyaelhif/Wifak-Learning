package wifak.bank.backend.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import wifak.bank.backend.Dtos.CourseAi.CourseAiAnalysisResponseDTO;
import wifak.bank.backend.Repositories.CourseAiAnalysisRepository;
import wifak.bank.backend.entities.Course;
import wifak.bank.backend.entities.CourseAiAnalysis;

import java.io.IOException;
import java.util.Map;

@Service
@Transactional
public class CourseAiAnalysisService {
    private final CourseService courseService;
    private final CourseAiAnalysisRepository repository;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ocr.ai.service-url:http://127.0.0.1:8001/api/v1}")
    private String ocrAiServiceUrl;

    public CourseAiAnalysisService(CourseService courseService,
                                   CourseAiAnalysisRepository repository,
                                   ObjectMapper objectMapper) {
        this.courseService = courseService;
        this.repository = repository;
        this.objectMapper = objectMapper;
    }

    public CourseAiAnalysisResponseDTO analyzeCourse(Long courseId, MultipartFile file, String username) {
        Course course = courseService.getCourseById(courseId);
        JsonNode analysis = callPythonAnalyze(courseId, file, username);

        CourseAiAnalysis entity = repository.findByCourseId(courseId).orElseGet(CourseAiAnalysis::new);
        entity.setCourse(course);
        entity.setPythonCourseId(text(analysis, "course_id"));
        entity.setStatus(text(analysis, "status", "COMPLETED"));
        entity.setTitle(text(analysis, "title"));
        entity.setLanguage(text(analysis, "language"));
        entity.setConfidence(number(analysis, "confidence"));
        entity.setShortSummary(text(analysis, "short_summary"));
        entity.setDetailedSummary(text(analysis, "detailed_summary"));
        entity.setAnalysisJson(analysis.toString());
        entity.setVectorIndexed(analysis.path("metadata").path("vector_indexed").asBoolean(false));

        return CourseAiAnalysisResponseDTO.fromEntity(repository.save(entity), objectMapper);
    }

    @Transactional(readOnly = true)
    public CourseAiAnalysisResponseDTO getAnalysis(Long courseId) {
        CourseAiAnalysis analysis = repository.findByCourseId(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "AI analysis not found for this course"));
        return CourseAiAnalysisResponseDTO.fromEntity(analysis, objectMapper);
    }

    @Transactional(readOnly = true)
    public JsonNode search(Long courseId, String query, int topK) {
        CourseAiAnalysis analysis = repository.findByCourseId(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "AI analysis not found for this course"));
        String url = UriComponentsBuilder.fromHttpUrl(ocrAiServiceUrl)
                .path("/courses/{pythonCourseId}/search")
                .queryParam("query", query)
                .queryParam("top_k", topK)
                .buildAndExpand(analysis.getPythonCourseId())
                .toUriString();
        return restTemplate.getForObject(url, JsonNode.class);
    }

    @Transactional(readOnly = true)
    public JsonNode ask(Long courseId, Map<String, Object> request) {
        CourseAiAnalysis analysis = repository.findByCourseId(courseId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "AI analysis not found for this course"));
        String url = ocrAiServiceUrl + "/courses/" + analysis.getPythonCourseId() + "/ask";
        return restTemplate.postForObject(url, request, JsonNode.class);
    }

    private JsonNode callPythonAnalyze(Long courseId, MultipartFile file, String username) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            ByteArrayResource fileResource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", fileResource);
            body.add("source_course_id", String.valueOf(courseId));
            body.add("created_by", username == null ? "backoffice" : username);
            ResponseEntity<String> response = restTemplate.exchange(
                    ocrAiServiceUrl + "/courses/analyze",
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    String.class
            );
            return objectMapper.readTree(response.getBody());
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unable to read uploaded file", ex);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "OCR AI service is unavailable: " + ex.getMessage(), ex);
        }
    }

    private String text(JsonNode node, String field) {
        return text(node, field, null);
    }

    private String text(JsonNode node, String field, String fallback) {
        JsonNode value = node.path(field);
        return value.isMissingNode() || value.isNull() ? fallback : value.asText();
    }

    private Double number(JsonNode node, String field) {
        JsonNode value = node.path(field);
        return value.isNumber() ? value.asDouble() : null;
    }
}
