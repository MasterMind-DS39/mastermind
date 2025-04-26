package com.ds39.mastermind.service;

import com.ds39.mastermind.dto.skill.SkillDTO;
import com.ds39.mastermind.dto.skill.SkillRequest;
import com.ds39.mastermind.model.skill.DifficultyLevel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Set;

public interface SkillService {
    
    SkillDTO createSkill(SkillRequest request);
    
    SkillDTO updateSkill(Long id, SkillRequest request);
    
    SkillDTO getSkillById(Long id);
    
    Page<SkillDTO> getAllSkills(Pageable pageable);
    
    Page<SkillDTO> getSkillsByCategory(Long categoryId, Pageable pageable);
    
    Page<SkillDTO> getSkillsByDifficultyLevel(DifficultyLevel level, Pageable pageable);
    
    Page<SkillDTO> searchSkills(String keyword, Pageable pageable);
    
    Page<SkillDTO> getTrendingSkills(Pageable pageable);
    
    Page<SkillDTO> getPopularSkills(Pageable pageable);
    
    void deleteSkill(Long id);
    
    void updateSkillPopularity(Long skillId, Double score);
    
    List<SkillDTO> getPrerequisiteSkills(Long skillId);
    
    List<SkillDTO> getRelatedSkills(Long skillId);
    
    void addPrerequisite(Long skillId, Long prerequisiteId);
    
    void removePrerequisite(Long skillId, Long prerequisiteId);
    
    Set<String> getTagsForSkill(Long skillId);
    
    void addTagToSkill(Long skillId, String tagName);
    
    void removeTagFromSkill(Long skillId, String tagName);
}