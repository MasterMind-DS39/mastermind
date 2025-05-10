package com.ds39.mastermind.controller;

import com.ds39.mastermind.dto.skill.SkillDTO;
import com.ds39.mastermind.service.SkillAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skill-analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SkillAnalyticsController {

    private final SkillAnalyticsService skillAnalyticsService;
    
    @PostMapping("/recalculate/{skillId}")
    public ResponseEntity<Void> recalculateSkillPopularity(@PathVariable Long skillId) {
        skillAnalyticsService.recalculateSkillPopularity(skillId);
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/identify-trending")
    public ResponseEntity<List<Long>> identifyTrendingSkills() {
        List<Long> trendingSkillIds = skillAnalyticsService.identifyTrendingSkills();
        return ResponseEntity.ok(trendingSkillIds);
    }
    
    @GetMapping("/trending")
    public ResponseEntity<Page<SkillDTO>> getTrendingSkills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillDTO> trendingSkills = skillAnalyticsService.getTrendingSkills(pageable);
        
        return ResponseEntity.ok(trendingSkills);
    }
    
    @PostMapping("/track-usage/{skillId}")
    public ResponseEntity<Void> trackSkillUsage(@PathVariable Long skillId) {
        skillAnalyticsService.trackSkillUsage(skillId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/tags/most-frequent")
    public ResponseEntity<Map<String, Long>> getMostFrequentTags(
            @RequestParam(defaultValue = "10") int limit) {
        
        Map<String, Long> frequentTags = skillAnalyticsService.getMostFrequentTags(limit);
        return ResponseEntity.ok(frequentTags);
    }
    
    @GetMapping("/popularity-by-category")
    public ResponseEntity<Map<String, Double>> getPopularityByCategory() {
        Map<String, Double> categoryPopularity = skillAnalyticsService.getPopularityByCategory();
        return ResponseEntity.ok(categoryPopularity);
    }
    
    @GetMapping("/distribution-by-difficulty")
    public ResponseEntity<Map<String, Long>> getSkillDistributionByDifficulty() {
        Map<String, Long> distribution = skillAnalyticsService.getSkillDistributionByDifficulty();
        return ResponseEntity.ok(distribution);
    }
}