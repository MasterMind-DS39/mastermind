package com.ds39.mastermind.dto.skill;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillCategoryDTO {
    private Long id;
    private String name;
    private String description;
    private String iconUrl;
    private Long parentCategoryId;
    private String parentCategoryName;
    private List<SkillCategoryDTO> subCategories = new ArrayList<>();
    private List<SkillDTO> skills = new ArrayList<>();
}