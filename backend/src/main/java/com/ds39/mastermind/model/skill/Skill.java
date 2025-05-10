package com.ds39.mastermind.model.skill;

import com.ds39.mastermind.model.base.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill extends BaseEntity {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "difficulty_level")
    @Enumerated(EnumType.STRING)
    private DifficultyLevel difficultyLevel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private SkillCategory category;

    @ManyToMany
    @JoinTable(
        name = "skill_prerequisites",
        joinColumns = @JoinColumn(name = "skill_id"),
        inverseJoinColumns = @JoinColumn(name = "prerequisite_id")
    )
    private Set<Skill> prerequisites = new HashSet<>();

    @ManyToMany(mappedBy = "prerequisites")
    private Set<Skill> requiredFor = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "related_skills",
        joinColumns = @JoinColumn(name = "skill_id"),
        inverseJoinColumns = @JoinColumn(name = "related_skill_id")
    )
    private Set<Skill> relatedSkills = new HashSet<>();

    @OneToMany(mappedBy = "skill", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SkillTag> tags = new ArrayList<>();

    // Fields for trending analytics
    @Column(name = "popularity_score")
    private Double popularityScore = 0.0;

    @Column(name = "usage_count")
    private Long usageCount = 0L;

    @Column(name = "is_trending")
    private Boolean isTrending = false;

    @Column(name = "trend_start_date")
    private java.time.LocalDate trendStartDate;
}