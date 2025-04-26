package com.ds39.mastermind.controller;

import com.ds39.mastermind.dto.skill.SkillCategoryDTO;
import com.ds39.mastermind.dto.skill.SkillCategoryRequest;
import com.ds39.mastermind.service.SkillCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skill-categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SkillCategoryController {

    private final SkillCategoryService skillCategoryService;
    
    @PostMapping
    public ResponseEntity<SkillCategoryDTO> createCategory(@Valid @RequestBody SkillCategoryRequest request) {
        SkillCategoryDTO createdCategory = skillCategoryService.createCategory(request);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SkillCategoryDTO> updateCategory(
            @PathVariable Long id, 
            @Valid @RequestBody SkillCategoryRequest request) {
        SkillCategoryDTO updatedCategory = skillCategoryService.updateCategory(id, request);
        return ResponseEntity.ok(updatedCategory);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SkillCategoryDTO> getCategoryById(@PathVariable Long id) {
        SkillCategoryDTO category = skillCategoryService.getCategoryById(id);
        return ResponseEntity.ok(category);
    }
    
    @GetMapping
    public ResponseEntity<List<SkillCategoryDTO>> getAllCategories() {
        List<SkillCategoryDTO> categories = skillCategoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    @GetMapping("/root")
    public ResponseEntity<List<SkillCategoryDTO>> getRootCategories() {
        List<SkillCategoryDTO> rootCategories = skillCategoryService.getRootCategories();
        return ResponseEntity.ok(rootCategories);
    }
    
    @GetMapping("/parent/{parentId}")
    public ResponseEntity<List<SkillCategoryDTO>> getSubcategories(@PathVariable Long parentId) {
        List<SkillCategoryDTO> subcategories = skillCategoryService.getSubcategories(parentId);
        return ResponseEntity.ok(subcategories);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        skillCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/exists/{name}")
    public ResponseEntity<Boolean> categoryExists(@PathVariable String name) {
        boolean exists = skillCategoryService.categoryExists(name);
        return ResponseEntity.ok(exists);
    }
}