package com.ds39.mastermind.service.impl;

import com.ds39.mastermind.dto.skill.SkillCategoryDTO;
import com.ds39.mastermind.dto.skill.SkillCategoryRequest;
import com.ds39.mastermind.dto.skill.SkillDTO;
import com.ds39.mastermind.exception.ResourceNotFoundException;
import com.ds39.mastermind.model.skill.SkillCategory;
import com.ds39.mastermind.repository.SkillCategoryRepository;
import com.ds39.mastermind.service.SkillCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillCategoryServiceImpl implements SkillCategoryService {

    private final SkillCategoryRepository skillCategoryRepository;

    @Override
    @Transactional
    public SkillCategoryDTO createCategory(SkillCategoryRequest request) {
        SkillCategory category = new SkillCategory();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIconUrl(request.getIconUrl());
        
        if (request.getParentCategoryId() != null) {
            SkillCategory parentCategory = skillCategoryRepository.findById(request.getParentCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with id: " + request.getParentCategoryId()));
            category.setParentCategory(parentCategory);
        }
        
        return mapToDTO(skillCategoryRepository.save(category));
    }

    @Override
    @Transactional
    public SkillCategoryDTO updateCategory(Long id, SkillCategoryRequest request) {
        SkillCategory category = skillCategoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
            
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIconUrl(request.getIconUrl());
        
        if (request.getParentCategoryId() != null) {
            if (!request.getParentCategoryId().equals(id)) {  // Prevent self-reference
                SkillCategory parentCategory = skillCategoryRepository.findById(request.getParentCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with id: " + request.getParentCategoryId()));
                category.setParentCategory(parentCategory);
            }
        } else {
            category.setParentCategory(null);
        }
        
        return mapToDTO(skillCategoryRepository.save(category));
    }

    @Override
    @Transactional(readOnly = true)
    public SkillCategoryDTO getCategoryById(Long id) {
        SkillCategory category = skillCategoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToDTO(category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillCategoryDTO> getAllCategories() {
        return skillCategoryRepository.findAllActive().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillCategoryDTO> getRootCategories() {
        return skillCategoryRepository.findByParentCategoryIsNull().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillCategoryDTO> getSubcategories(Long parentId) {
        return skillCategoryRepository.findByParentCategoryId(parentId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        SkillCategory category = skillCategoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
            
        // Soft delete by setting isActive to false
        category.setIsActive(false);
        skillCategoryRepository.save(category);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean categoryExists(String name) {
        return skillCategoryRepository.existsByName(name);
    }
    
    // Helper method to map entity to DTO
    private SkillCategoryDTO mapToDTO(SkillCategory category) {
        SkillCategoryDTO dto = new SkillCategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setIconUrl(category.getIconUrl());
        
        if (category.getParentCategory() != null) {
            dto.setParentCategoryId(category.getParentCategory().getId());
            dto.setParentCategoryName(category.getParentCategory().getName());
        }
        
        // Map subcategories (only first level to avoid circular references)
        if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
            dto.setSubCategories(category.getSubCategories().stream()
                .map(subCategory -> {
                    SkillCategoryDTO subDto = new SkillCategoryDTO();
                    subDto.setId(subCategory.getId());
                    subDto.setName(subCategory.getName());
                    subDto.setDescription(subCategory.getDescription());
                    subDto.setIconUrl(subCategory.getIconUrl());
                    return subDto;
                })
                .collect(Collectors.toList()));
        }
        
        // We're not mapping skills here to avoid loading too much data at once
        
        return dto;
    }
}