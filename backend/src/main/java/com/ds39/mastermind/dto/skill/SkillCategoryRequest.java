package com.ds39.mastermind.dto.skill;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillCategoryRequest {
    
    @NotBlank(message = "Category name is required")
    private String name;
    
    private String description;
    
    private String iconUrl;
    
    private Long parentCategoryId;
}