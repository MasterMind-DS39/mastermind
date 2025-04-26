package com.ds39.mastermind.service.impl;

import com.ds39.mastermind.dto.skill.SkillDTO;
import com.ds39.mastermind.model.skill.DifficultyLevel;
import com.ds39.mastermind.model.skill.Skill;
import com.ds39.mastermind.model.skill.SkillTag;
import com.ds39.mastermind.repository.SkillRepository;
import com.ds39.mastermind.repository.SkillTagRepository;
import com.ds39.mastermind.service.SkillAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillAnalyticsServiceImpl implements SkillAnalyticsService {

    private final SkillRepository skillRepository;
    private final SkillTagRepository skillTagRepository;
    private final SkillServiceImpl skillService; // Using implementation for mapToDTO method
    
    // Threshold for trending skills
    private static final double TRENDING_THRESHOLD = 5.0;
    
    @Override
    @Transactional
    public void recalculateSkillPopularity(Long skillId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));
        
        // The popularity score is calculated based on usage count and tag frequency
        // This is a simplified version - in a real-world scenario, you might want to 
        // include more factors such as engagement metrics, recency, etc.
        
        double baseScore = skill.getUsageCount() * 0.5;
        
        // Add points for each tag
        List<SkillTag> tags = skillTagRepository.findBySkillId(skillId);
        double tagScore = tags.stream()
            .mapToLong(SkillTag::getUsageCount)
            .sum() * 0.3;
        
        // Calculate final score
        double finalScore = baseScore + tagScore;
        
        // Update skill
        skill.setPopularityScore(finalScore);
        
        // Check if the skill should be marked as trending
        boolean isTrending = finalScore >= TRENDING_THRESHOLD;
        skill.setIsTrending(isTrending);
        
        // If it's newly trending, set the start date
        if (isTrending && skill.getTrendStartDate() == null) {
            skill.setTrendStartDate(LocalDate.now());
        } else if (!isTrending) {
            skill.setTrendStartDate(null);
        }
        
        skillRepository.save(skill);
    }

    @Override
    @Transactional
    public List<Long> identifyTrendingSkills() {
        // Get all skills with non-zero usage
        List<Skill> activeSkills = skillRepository.findAll().stream()
            .filter(s -> s.getUsageCount() > 0)
            .collect(Collectors.toList());
        
        // Recalculate popularity for each skill
        for (Skill skill : activeSkills) {
            recalculateSkillPopularity(skill.getId());
        }
        
        // Return IDs of trending skills
        return skillRepository.findAll().stream()
            .filter(Skill::getIsTrending)
            .map(Skill::getId)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDTO> getTrendingSkills(Pageable pageable) {
        return skillRepository.findTrendingSkills(pageable)
            .map(skill -> skillService.mapToDTO(skill));
    }

    @Override
    @Transactional
    public void trackSkillUsage(Long skillId) {
        Skill skill = skillRepository.findById(skillId)
            .orElseThrow(() -> new RuntimeException("Skill not found with id: " + skillId));
        
        skill.setUsageCount(skill.getUsageCount() + 1);
        skillRepository.save(skill);
        
        // Recalculate popularity after usage
        recalculateSkillPopularity(skillId);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getMostFrequentTags(int limit) {
        // Get all tags
        List<SkillTag> allTags = skillTagRepository.findAll();
        
        // Group by tag name and sum usage counts
        Map<String, Long> tagCounts = allTags.stream()
            .collect(Collectors.groupingBy(
                SkillTag::getTagName,
                Collectors.summingLong(SkillTag::getUsageCount)
            ));
        
        // Sort by count (descending) and limit
        return tagCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
            .limit(limit)
            .collect(Collectors.toMap(
                Map.Entry::getKey,
                Map.Entry::getValue,
                (e1, e2) -> e1,
                LinkedHashMap::new
            ));
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Double> getPopularityByCategory() {
        // Get all skills
        List<Skill> allSkills = skillRepository.findAll();
        
        // Group by category and calculate average popularity
        Map<String, Double> categoryPopularity = new HashMap<>();
        Map<String, List<Double>> categoryScores = new HashMap<>();
        
        for (Skill skill : allSkills) {
            String categoryName = skill.getCategory().getName();
            
            if (!categoryScores.containsKey(categoryName)) {
                categoryScores.put(categoryName, new ArrayList<>());
            }
            
            categoryScores.get(categoryName).add(skill.getPopularityScore());
        }
        
        // Calculate averages
        for (Map.Entry<String, List<Double>> entry : categoryScores.entrySet()) {
            double average = entry.getValue().stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);
            
            categoryPopularity.put(entry.getKey(), average);
        }
        
        return categoryPopularity;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getSkillDistributionByDifficulty() {
        // Get all skills
        List<Skill> allSkills = skillRepository.findAll();
        
        // Count by difficulty level
        Map<DifficultyLevel, Long> countByDifficulty = allSkills.stream()
            .collect(Collectors.groupingBy(
                Skill::getDifficultyLevel,
                Collectors.counting()
            ));
        
        // Convert enum keys to strings
        Map<String, Long> result = new HashMap<>();
        for (Map.Entry<DifficultyLevel, Long> entry : countByDifficulty.entrySet()) {
            result.put(entry.getKey().name(), entry.getValue());
        }
        
        return result;
    }
}