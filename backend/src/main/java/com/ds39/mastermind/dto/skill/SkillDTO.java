package com.ds39.mastermind.dto.skill;

import com.ds39.mastermind.model.skill.DifficultyLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillDTO {
    private Long id;
    private String name;
    private String description;
    private DifficultyLevel difficultyLevel;
    private Long categoryId;
    private String categoryName;
    private Set<Long> prerequisiteIds = new HashSet<>();
    private Set<Long> relatedSkillIds = new HashSet<>();
    private List<String> tags;
    private Double popularityScore;
    private Long usageCount;
    private Boolean isTrending;
}