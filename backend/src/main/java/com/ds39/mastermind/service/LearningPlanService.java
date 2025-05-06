package com.ds39.mastermind.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ds39.mastermind.entity.LearningPlan;
import com.ds39.mastermind.entity.Lesson;
import com.ds39.mastermind.repository.LearningPlanRepository;
import com.ds39.mastermind.entity.Resource; // Ensure Resource is imported
import com.ds39.mastermind.repository.LessonRepository; // Import LessonRepository

@Service
public class LearningPlanService {

    private final LearningPlanRepository planRepository;
    private final LessonRepository lessonRepository; // Assuming you have a LessonRepository
    

    public LearningPlanService(LearningPlanRepository planRepository , LessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository; 
        this.planRepository = planRepository;
    }

//createLearningPlan
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

//updateLearningPlan
public LearningPlan updateLearningPlan(long planId, LearningPlan updatedPlan) {
    LearningPlan existingPlan = planRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Learning plan not found with ID: " + planId));

    // Update main fields
    if (updatedPlan.getTitle() != null) {
        existingPlan.setTitle(updatedPlan.getTitle());
    }
    if (updatedPlan.getDescription() != null) {
        existingPlan.setDescription(updatedPlan.getDescription());
    }
    if (updatedPlan.getUpvotes() >= 0) {
        existingPlan.setUpvotes(updatedPlan.getUpvotes());
    }

    // Safely clear and reassign lessons and resources
    if (updatedPlan.getLessons() != null) {
        List<Lesson> existingLessons = existingPlan.getLessons();
        existingLessons.clear();

        for (Lesson newLesson : updatedPlan.getLessons()) {
            newLesson.setPlan(existingPlan);

            if (newLesson.getResources() != null) {
                for (Resource res : newLesson.getResources()) {
                    res.setLesson(newLesson);
                }
            }

            existingLessons.add(newLesson);
        }
    }

    return planRepository.save(existingPlan);
}


// getLearningPlan
    public LearningPlan getLearningPlan(Long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Learning plan not found with ID: " + planId));
    }

    //getLearningPlanByUserId
    public List<LearningPlan> getAllLearningPlansByUserId(Long userId) {
        return planRepository.findByCreatedByUserId(userId);
    }

//deleteLearningPlan
    public LearningPlan deleteLearningPlan(long planId) {
        LearningPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with ID: " + planId));
        planRepository.delete(plan);
        return plan;
    }

    //getallLearningPlans
    public List<LearningPlan> getAllLearningPlans() {
        return planRepository.findAll();
    }

    //upvoteLearningPlan
    public LearningPlan upvoteLearningPlan(Long planId) {
        LearningPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found with ID: " + planId));
        plan.setUpvotes(plan.getUpvotes() + 1);
        return planRepository.save(plan);
    }

    //deleteLesson
    public Lesson deleteLesson(long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with ID: " + lessonId));
        lessonRepository.delete(lesson);
        return lesson;
    }


}
