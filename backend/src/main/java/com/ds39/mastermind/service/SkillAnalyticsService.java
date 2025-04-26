package com.ds39.mastermind.service;

import com.ds39.mastermind.dto.skill.SkillDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface SkillAnalyticsService {
    
    /**
     * Recalculates the popularity score for a skill
     * @param skillId The skill ID to update
     */
    void recalculateSkillPopularity(Long skillId);
    
    /**
     * Identifies trending skills based on recent usage and popularity
     * @return List of trending skill IDs
     */
    List<Long> identifyTrendingSkills();
    
    /**
     * Gets trending skills with pagination
     * @param pageable Pagination information
     * @return Page of trending skills
     */
    Page<SkillDTO> getTrendingSkills(Pageable pageable);
    
    /**
     * Tracks the usage of a skill (increments count)
     * @param skillId The skill ID to track
     */
    void trackSkillUsage(Long skillId);
    
    /**
     * Gets the most frequently used skill tags
     * @param limit Maximum number of tags to return
     * @return Map of tag names to usage counts
     */
    Map<String, Long> getMostFrequentTags(int limit);
    
    /**
     * Gets skill popularity statistics by category
     * @return Map of category names to average popularity scores
     */
    Map<String, Double> getPopularityByCategory();
    
    /**
     * Gets skill distribution by difficulty level
     * @return Map of difficulty levels to counts
     */
    Map<String, Long> getSkillDistributionByDifficulty();
}