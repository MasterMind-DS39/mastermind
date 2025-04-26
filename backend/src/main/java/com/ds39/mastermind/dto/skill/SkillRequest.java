package com.ds39.mastermind.dto.skill;

import com.ds39.mastermind.model.skill.DifficultyLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class SkillRequest {
    
    @NotBlank(message = "Skill name is required")
    private String name;
    
    private String description;
    
    @NotNull(message = "Difficulty level is required")
    private DifficultyLevel difficultyLevel;
    
    @NotNull(message = "Category ID is required")
    private Long categoryId;
    
    private Set<Long> prerequisiteIds = new HashSet<>();
    
    private Set<Long> relatedSkillIds = new HashSet<>();
    
    private List<String> tags;
}