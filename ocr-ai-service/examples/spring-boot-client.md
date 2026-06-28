# Exemple client Spring Boot

```java
@Service
public class OcrAiClient {
    private final WebClient webClient = WebClient.builder()
        .baseUrl("http://localhost:8001/api/v1")
        .build();

    public Mono<String> analyze(MultipartFile file, Long courseId, String username) throws IOException {
        MultipartBodyBuilder body = new MultipartBodyBuilder();
        body.part("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });
        body.part("source_course_id", String.valueOf(courseId));
        body.part("created_by", username);

        return webClient.post()
            .uri("/courses/analyze")
            .contentType(MediaType.MULTIPART_FORM_DATA)
            .body(BodyInserters.fromMultipartData(body.build()))
            .retrieve()
            .bodyToMono(String.class);
    }
}
```
