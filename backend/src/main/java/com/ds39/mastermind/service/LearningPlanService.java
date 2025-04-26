package com.ds39.mastermind.service;

import org.springframework.stereotype.Service;

import com.ds39.mastermind.entity.LearningPlan;
import com.ds39.mastermind.entity.Lesson;
import com.ds39.mastermind.repository.LearningPlanRepository;
import com.ds39.mastermind.entity.Resource; // Ensure Resource is imported

@Service
public class LearningPlanService {

    private final LearningPlanRepository planRepository;
    

    public LearningPlanService(LearningPlanRepository planRepository) {
        this.planRepository = planRepository;
    }


public LearningPlan createLearningPlan(Long userId, LearningPlan plan) {
    plan.setCreatedByUserId(userId);

    if (plan.getLessons() != null) {
        for (Lesson lesson : plan.getLessons()) {
            lesson.setPlan(plan); 

            if (lesson.getResources() != null) {
                for (Resource resource : lesson.getResources()) {
                    resource.setLesson(lesson); 
                }
            }
        }
    }

    return planRepository.save(plan);
}

public LearningPlan updateLearningPlan(long planId, LearningPlan updatedPlan) {
    LearningPlan existingPlan = planRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Learning plan not found with ID: " + planId));

    existingPlan.setTitle(updatedPlan.getTitle());
    existingPlan.setDescription(updatedPlan.getDescription());
    existingPlan.setUpvotes(updatedPlan.getUpvotes());

    
    if (updatedPlan.getLessons() != null) {
        for (Lesson lesson : updatedPlan.getLessons()) {
            lesson.setPlan(existingPlan); 
            if (lesson.getResources() != null) {
                for (Resource resource : lesson.getResources()) {
                    resource.setLesson(lesson); 
                }
            }
        }
        existingPlan.getLessons().clear(); // remove old references safely
        existingPlan.getLessons().addAll(updatedPlan.getLessons()); // add updated ones
    }

    return planRepository.save(existingPlan);
}

    public void deleteLearningPlan() {
        // Logic to delete a learning plan

        
    }

    public LearningPlan getLearningPlan(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with ID: " + planId));
    }
}
