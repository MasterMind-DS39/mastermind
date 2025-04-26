package com.ds39.mastermind.repository;

import com.ds39.mastermind.model.skill.SkillCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillCategoryRepository extends JpaRepository<SkillCategory, Long> {
    
    Optional<SkillCategory> findByName(String name);
    
    List<SkillCategory> findByParentCategoryIsNull();
    
    List<SkillCategory> findByParentCategoryId(Long parentId);
    
    @Query("SELECT sc FROM SkillCategory sc WHERE sc.isActive = true")
    List<SkillCategory> findAllActive();
    
    boolean existsByName(String name);
}