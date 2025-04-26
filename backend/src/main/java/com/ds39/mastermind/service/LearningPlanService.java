package com.ds39.mastermind.service;

import com.ds39.mastermind.entity.LearningPlan;
import com.ds39.mastermind.repository.LearningPlanRepository;

public class LearningPlanService {

    private final LearningPlanRepository planRepository;
    

    public LearningPlanService(LearningPlanRepository planRepository) {
        this.planRepository = planRepository;
    }


    public LearningPlan createLearningPlan(Long userId, LearningPlan plan) {
        // Logic to create a learning plan
        plan.setCreatedByUserId(userId);//setter

        return planRepository.save(plan);
    }

    public LearningPlan updateLearningPlan(long planId , LearningPlan plan) {
        // Logic to update a learning plan
        LearningPlan planNeedsUpdating = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with ID: " + planId));//When optional comes....Exception handing is must

        planNeedsUpdating.setDescription(plan.getDescription());
        planNeedsUpdating.setTitle(plan.getTitle());
        planNeedsUpdating.setLessons(plan.getLessons());
        planNeedsUpdating.setUpvotes(plan.getUpvotes());
        
        return planRepository.save(planNeedsUpdating);
    }

    public void deleteLearningPlan() {
        // Logic to delete a learning plan
    }

    public LearningPlan getLearningPlan(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with ID: " + planId));
    }
}
