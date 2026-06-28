package wifak.bank.backend.Controllers;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import wifak.bank.backend.Dtos.CourseAi.CourseAiAnalysisResponseDTO;
import wifak.bank.backend.Services.CourseAiAnalysisService;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/course-ai")
public class CourseAiAnalysisController {
    private final CourseAiAnalysisService service;

    public CourseAiAnalysisController(CourseAiAnalysisService service) {
        this.service = service;
    }

    @PostMapping(value = "/course/{courseId}/analyze", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CourseAiAnalysisResponseDTO analyzeCourse(@PathVariable Long courseId,
                                                     @RequestPart("file") MultipartFile file,
                                                     Principal principal) {
        return service.analyzeCourse(courseId, file, principal == null ? null : principal.getName());
    }

    @GetMapping("/course/{courseId}")
    public CourseAiAnalysisResponseDTO getAnalysis(@PathVariable Long courseId) {
        return service.getAnalysis(courseId);
    }

    @GetMapping("/course/{courseId}/search")
    public JsonNode search(@PathVariable Long courseId,
                           @RequestParam String query,
                           @RequestParam(defaultValue = "5") int topK) {
        return service.search(courseId, query, topK);
    }

    @PostMapping("/course/{courseId}/ask")
    public JsonNode ask(@PathVariable Long courseId, @RequestBody Map<String, Object> request) {
        return service.ask(courseId, request);
    }
}
