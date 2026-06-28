package wifak.bank.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "course_ai_analyses")
@Data
@NoArgsConstructor
public class CourseAiAnalysis {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false, unique = true)
    private Course course;

    @Column(name = "python_course_id", length = 80)
    private String pythonCourseId;

    @Column(nullable = false, length = 40)
    private String status = "COMPLETED";

    @Column(length = 500)
    private String title;

    @Column(length = 20)
    private String language;

    private Double confidence;

    @Column(name = "short_summary", length = 5000)
    private String shortSummary;

    @Lob
    @Column(name = "detailed_summary", columnDefinition = "LONGTEXT")
    private String detailedSummary;

    @Lob
    @Column(name = "analysis_json", nullable = false, columnDefinition = "LONGTEXT")
    private String analysisJson;

    @Column(name = "vector_indexed")
    private Boolean vectorIndexed = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
