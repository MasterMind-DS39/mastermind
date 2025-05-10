package com.ds39.mastermind.repository;

import com.ds39.mastermind.model.skill.SkillTag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillTagRepository extends JpaRepository<SkillTag, Long> {
    
    List<SkillTag> findBySkillId(Long skillId);
    
    Optional<SkillTag> findByTagNameAndSkillId(String tagName, Long skillId);
    
    @Query("SELECT st FROM SkillTag st WHERE st.isActive = true AND st.isTrending = true ORDER BY st.usageCount DESC")
    Page<SkillTag> findTrendingTags(Pageable pageable);
    
    @Query("SELECT st FROM SkillTag st WHERE LOWER(st.tagName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<SkillTag> findTagsForAutocomplete(String query, Pageable pageable);
}