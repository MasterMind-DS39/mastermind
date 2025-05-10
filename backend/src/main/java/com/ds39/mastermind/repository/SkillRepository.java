package com.ds39.mastermind.repository;

import com.ds39.mastermind.model.skill.DifficultyLevel;
import com.ds39.mastermind.model.skill.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findByNameAndCategoryId(String name, Long categoryId);
    
    List<Skill> findByCategoryId(Long categoryId);
    
    Page<Skill> findByCategoryId(Long categoryId, Pageable pageable);
    
    Page<Skill> findByDifficultyLevel(DifficultyLevel difficultyLevel, Pageable pageable);
    
    @Query("SELECT s FROM Skill s WHERE s.isActive = true AND s.isTrending = true ORDER BY s.popularityScore DESC")
    Page<Skill> findTrendingSkills(Pageable pageable);
    
    @Query("SELECT s FROM Skill s WHERE s.isActive = true AND " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Skill> searchSkills(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT s FROM Skill s WHERE s.isActive = true ORDER BY s.usageCount DESC")
    Page<Skill> findPopularSkills(Pageable pageable);
}