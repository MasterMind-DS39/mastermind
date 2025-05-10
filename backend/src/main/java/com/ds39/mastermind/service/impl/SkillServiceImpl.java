package com.ds39.mastermind.service.impl;

import com.ds39.mastermind.dto.skill.SkillDTO;
import com.ds39.mastermind.dto.skill.SkillRequest;
import com.ds39.mastermind.exception.ResourceNotFoundException;
import com.ds39.mastermind.model.skill.DifficultyLevel;
import com.ds39.mastermind.model.skill.Skill;
import com.ds39.mastermind.model.skill.SkillCategory;
import com.ds39.mastermind.model.skill.SkillTag;
import com.ds39.mastermind.repository.SkillCategoryRepository;
import com.ds39.mastermind.repository.SkillRepository;
import com.ds39.mastermind.repository.SkillTagRepository;
import com.ds39.mastermind.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final SkillCategoryRepository categoryRepository;
    private final SkillTagRepository tagRepository;

    @Override
    @Transactional
    public SkillDTO createSkill(SkillRequest request) {
        SkillCategory category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        
        Skill skill = new Skill();
        skill.setName(request.getName());
        skill.setDescription(request.getDescription());
        skill.setDifficultyLevel(request.getDifficultyLevel());
        skill.setCategory(category);
        
        // Save the skill first to get an ID
        skill = skillRepository.save(skill);
        
        // Handle prerequisites if any
        if (request.getPrerequisiteIds() != null && !request.getPrerequisiteIds().isEmpty()) {
            Set<Skill> prerequisites = new HashSet<>();
            for (Long preId : request.getPrerequisiteIds()) {
                Skill prerequisite = skillRepository.findById(preId)
                    .orElseThrow(() -> new ResourceNotFoundException("Prerequisite skill not found with id: " + preId));
                prerequisites.add(prerequisite);
            }
            skill.setPrerequisites(prerequisites);
        }
        
        // Handle related skills if any
        if (request.getRelatedSkillIds() != null && !request.getRelatedSkillIds().isEmpty()) {
            Set<Skill> relatedSkills = new HashSet<>();
            for (Long relatedId : request.getRelatedSkillIds()) {
                Skill related = skillRepository.findById(relatedId)
                    .orElseThrow(() -> new ResourceNotFoundException("Related skill not found with id: " + relatedId));
                relatedSkills.add(related);
            }
            skill.setRelatedSkills(relatedSkills);
        }
        
        // Handle tags if any
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            for (String tagName : request.getTags()) {
                SkillTag tag = new SkillTag();
                tag.setTagName(tagName);
                tag.setSkill(skill);
                tagRepository.save(tag);
            }
        }
        
        // Save again with all relationships
        skill = skillRepository.save(skill);
        
        return mapToDTO(skill);
    }

    @Override
    @Transactional
    public SkillDTO updateSkill(Long id, SkillRequest request) {
        Skill skill = skillRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        
        SkillCategory category = categoryRepository.findById(request.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        
        skill.setName(request.getName());
        skill.setDescription(request.getDescription());
        skill.setDifficultyLevel(request.getDifficultyLevel());
        skill.setCategory(category);
        
        // Update prerequisites
        skill.getPrerequisites().clear();
        if (request.getPrerequisiteIds() != null && !request.getPrerequisiteIds().isEmpty()) {
            for (Long preId : request.getPrerequisiteIds()) {
                Skill prerequisite = skillRepository.findById(preId)
                    .orElseThrow(() -> new ResourceNotFoundException("Prerequisite skill not found with id: " + preId));
                skill.getPrerequisites().add(prerequisite);
            }
        }
        
        // Update related skills
        skill.getRelatedSkills().clear();
        if (request.getRelatedSkillIds() != null && !request.getRelatedSkillIds().isEmpty()) {
            for (Long relatedId : request.getRelatedSkillIds()) {
                Skill related = skillRepository.findById(relatedId)
                    .orElseThrow(() -> new ResourceNotFoundException("Related skill not found with id: " + relatedId));
                skill.getRelatedSkills().add(related);
            }
        }
        
        // Update tags
        // First remove all existing tags
        List<SkillTag> existingTags = tagRepository.findBySkillId(id);
        for (SkillTag tag : existingTags) {
            tagRepository.delete(tag);
        }
        
        // Add new tags
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            for (String tagName : request.getTags()) {
                SkillTag tag = new SkillTag();
                tag.setTagName(tagName);
                tag.setSkill(skill);
                tagRepository.save(tag);
            }
        }
        
        skill = skillRepository.save(skill);
        
        return mapToDTO(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public SkillDTO getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        return mapToDTO(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> getAllSkills(Pageable pageable) {
        return skillRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> getSkillsByCategory(Long categoryId, Pageable pageable) {
        return skillRepository.findByCategoryId(categoryId, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> getSkillsByDifficultyLevel(DifficultyLevel level, Pageable pageable) {
        return skillRepository.findByDifficultyLevel(level, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> searchSkills(String keyword, Pageable pageable) {
        return skillRepository.searchSkills(keyword, pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> getTrendingSkills(Pageable pageable) {
        return skillRepository.findTrendingSkills(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> getPopularSkills(Pageable pageable) {
        return skillRepository.findPopularSkills(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        Skill skill = skillRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        
        // Soft delete
        skill.setIsActive(false);
        skillRepository.save(skill);
    }

    @Override
    @Transactional
    public void updateSkillPopularity(Long skillId, Double score) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        
        skill.setPopularityScore(score);
        skillRepository.save(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDTO> getPrerequisiteSkills(Long skillId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        
        return skill.getPrerequisites().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDTO> getRelatedSkills(Long skillId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        
        return skill.getRelatedSkills().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void addPrerequisite(Long skillId, Long prerequisiteId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        
        Skill prerequisite = skillRepository.findById(prerequisiteId)
            .orElseThrow(() -> new ResourceNotFoundException("Prerequisite skill not found with id: " + prerequisiteId));
        
        skill.getPrerequisites().add(prerequisite);
        skillRepository.save(skill);
    }

    @Override
    @Transactional
    public void removePrerequisite(Long skillId, Long prerequisiteId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        
        skill.getPrerequisites().removeIf(s -> s.getId().equals(prerequisiteId));
        skillRepository.save(skill);
    }

    @Override
    @Transactional(readOnly = true)
    public Set<String> getTagsForSkill(Long skillId) {
        List<SkillTag> tags = tagRepository.findBySkillId(skillId);
        return tags.stream()
            .map(SkillTag::getTagName)
            .collect(Collectors.toSet());
    }

    @Override
    @Transactional
    public void addTagToSkill(Long skillId, String tagName) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + skillId));
        
        // Check if tag already exists
        if (tagRepository.findByTagNameAndSkillId(tagName, skillId).isEmpty()) {
            SkillTag tag = new SkillTag();
            tag.setTagName(tagName);
            tag.setSkill(skill);
            tagRepository.save(tag);
        }
    }

    @Override
    @Transactional
    public void removeTagFromSkill(Long skillId, String tagName) {
        tagRepository.findByTagNameAndSkillId(tagName, skillId)
            .ifPresent(tagRepository::delete);
    }
    
    // Helper method to map entity to DTO
    SkillDTO mapToDTO(Skill skill) {
        SkillDTO dto = new SkillDTO();
        dto.setId(skill.getId());
        dto.setName(skill.getName());
        dto.setDescription(skill.getDescription());
        dto.setDifficultyLevel(skill.getDifficultyLevel());
        
        if (skill.getCategory() != null) {
            dto.setCategoryId(skill.getCategory().getId());
            dto.setCategoryName(skill.getCategory().getName());
        }
        
        // Map prerequisite IDs
        dto.setPrerequisiteIds(skill.getPrerequisites().stream()
            .map(Skill::getId)
            .collect(Collectors.toSet()));
        
        // Map related skill IDs
        dto.setRelatedSkillIds(skill.getRelatedSkills().stream()
            .map(Skill::getId)
            .collect(Collectors.toSet()));
        
        // Map tags
        dto.setTags(skill.getTags().stream()
            .map(SkillTag::getTagName)
            .collect(Collectors.toList()));
        
        dto.setPopularityScore(skill.getPopularityScore());
        dto.setUsageCount(skill.getUsageCount());
        dto.setIsTrending(skill.getIsTrending());
        
        return dto;
    }
}