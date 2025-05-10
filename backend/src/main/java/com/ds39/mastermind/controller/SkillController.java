package com.ds39.mastermind.controller;

import com.ds39.mastermind.dto.skill.SkillDTO;
import com.ds39.mastermind.dto.skill.SkillRequest;
import com.ds39.mastermind.model.skill.DifficultyLevel;
import com.ds39.mastermind.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SkillController {

    private final SkillService skillService;
    
    @PostMapping
    public ResponseEntity<SkillDTO> createSkill(@Valid @RequestBody SkillRequest request) {
        SkillDTO createdSkill = skillService.createSkill(request);
        return new ResponseEntity<>(createdSkill, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SkillDTO> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody SkillRequest request) {
        SkillDTO updatedSkill = skillService.updateSkill(id, request);
        return ResponseEntity.ok(updatedSkill);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SkillDTO> getSkillById(@PathVariable Long id) {
        SkillDTO skill = skillService.getSkillById(id);
        return ResponseEntity.ok(skill);
    }
    
    @GetMapping
    public ResponseEntity<Page<SkillDTO>> getAllSkills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        Page<SkillDTO> skills = skillService.getAllSkills(pageable);
        
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<SkillDTO>> getSkillsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillDTO> skills = skillService.getSkillsByCategory(categoryId, pageable);
        
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/difficulty/{level}")
    public ResponseEntity<Page<SkillDTO>> getSkillsByDifficultyLevel(
            @PathVariable DifficultyLevel level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillDTO> skills = skillService.getSkillsByDifficultyLevel(level, pageable);
        
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/search")
    public ResponseEntity<Page<SkillDTO>> searchSkills(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillDTO> skills = skillService.searchSkills(keyword, pageable);
        
        return ResponseEntity.ok(skills);
    }
    
    @GetMapping("/trending")
    public ResponseEntity<Page<SkillDTO>> getTrendingSkills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillDTO> trendingSkills = skillService.getTrendingSkills(pageable);
        
        return ResponseEntity.ok(trendingSkills);
    }
    
    @GetMapping("/popular")
    public ResponseEntity<Page<SkillDTO>> getPopularSkills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillDTO> popularSkills = skillService.getPopularSkills(pageable);
        
        return ResponseEntity.ok(popularSkills);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}/prerequisites")
    public ResponseEntity<List<SkillDTO>> getPrerequisiteSkills(@PathVariable Long id) {
        List<SkillDTO> prerequisites = skillService.getPrerequisiteSkills(id);
        return ResponseEntity.ok(prerequisites);
    }
    
    @GetMapping("/{id}/related")
    public ResponseEntity<List<SkillDTO>> getRelatedSkills(@PathVariable Long id) {
        List<SkillDTO> relatedSkills = skillService.getRelatedSkills(id);
        return ResponseEntity.ok(relatedSkills);
    }
    
    @PostMapping("/{id}/prerequisites/{prerequisiteId}")
    public ResponseEntity<Void> addPrerequisite(
            @PathVariable Long id,
            @PathVariable Long prerequisiteId) {
        
        skillService.addPrerequisite(id, prerequisiteId);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}/prerequisites/{prerequisiteId}")
    public ResponseEntity<Void> removePrerequisite(
            @PathVariable Long id,
            @PathVariable Long prerequisiteId) {
        
        skillService.removePrerequisite(id, prerequisiteId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{id}/tags")
    public ResponseEntity<Set<String>> getTagsForSkill(@PathVariable Long id) {
        Set<String> tags = skillService.getTagsForSkill(id);
        return ResponseEntity.ok(tags);
    }
    
    @PostMapping("/{id}/tags/{tagName}")
    public ResponseEntity<Void> addTagToSkill(
            @PathVariable Long id,
            @PathVariable String tagName) {
        
        skillService.addTagToSkill(id, tagName);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}/tags/{tagName}")
    public ResponseEntity<Void> removeTagFromSkill(
            @PathVariable Long id,
            @PathVariable String tagName) {
        
        skillService.removeTagFromSkill(id, tagName);
        return ResponseEntity.ok().build();
    }
}