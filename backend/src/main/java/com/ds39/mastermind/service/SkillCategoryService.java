package com.ds39.mastermind.service;

import com.ds39.mastermind.dto.skill.SkillCategoryDTO;
import com.ds39.mastermind.dto.skill.SkillCategoryRequest;

import java.util.List;

public interface SkillCategoryService {
    
    SkillCategoryDTO createCategory(SkillCategoryRequest request);
    
    SkillCategoryDTO updateCategory(Long id, SkillCategoryRequest request);
    
    SkillCategoryDTO getCategoryById(Long id);
    
    List<SkillCategoryDTO> getAllCategories();
    
    List<SkillCategoryDTO> getRootCategories();
    
    List<SkillCategoryDTO> getSubcategories(Long parentId);
    
    void deleteCategory(Long id);
    
    boolean categoryExists(String name);
}