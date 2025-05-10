package com.ds39.mastermind.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ds39.mastermind.entity.LearningPlan;
import com.ds39.mastermind.entity.Lesson;
import com.ds39.mastermind.repository.LearningPlanRepository;
import com.ds39.mastermind.entity.Resource; // Ensure Resource is imported
import com.ds39.mastermind.entity.UserLessonProgress;
import com.ds39.mastermind.repository.LessonRepository; // Import LessonRepository
import com.ds39.mastermind.repository.UserLessonProgressRepository; // Import UserLessonProgressRepository
import com.ds39.mastermind.repository.UserRepository;
import com.ds39.mastermind.entity.User; // Import User entity

@Service
public class LearningPlanService {

    private final LearningPlanRepository planRepository;
    private final LessonRepository lessonRepository; 
    private final UserLessonProgressRepository progressRepo;
    private final UserRepository userRepository;
    

    public LearningPlanService(LearningPlanRepository planRepository , LessonRepository lessonRepository , UserLessonProgressRepository progressRepo , UserRepository userRepository) {
        this.userRepository = userRepository;
        this.lessonRepository = lessonRepository; 
        this.planRepository = planRepository;
        this.progressRepo = progressRepo;
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

    // getCompletedPlansByUser
    public List<LearningPlan> getCompletedPlansByUser(Long userId) {
        User user = userRepository.findById(userId.intValue())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return new ArrayList<>(user.getCompletedPlans());
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
    public LearningPlan upvoteLearningPlan(Long planId, Long userId) {
        LearningPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found"));
        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Prevent duplicate upvotes
        if (!user.getUpvotedPlans().contains(plan)) {
            user.getUpvotedPlans().add(plan);
            plan.setUpvotes(plan.getUpvotes() + 1);
            userRepository.save(user);
        } else {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User has already upvoted this plan");
        }

        return plan;
    }

    // removeUpvoteFromLearningPlan
    public LearningPlan removeUpvoteFromLearningPlan(Long planId, Long userId) {
        LearningPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Learning plan not found"));
        User user = userRepository.findById(userId.intValue())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getUpvotedPlans().contains(plan)) {
            user.getUpvotedPlans().remove(plan);
            plan.getUpvotedByUsers().remove(user);
            plan.setUpvotes(plan.getUpvotes() - 1);
            userRepository.save(user);
        }

        return plan;
    }

    //deleteLesson
    public Lesson deleteLesson(long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with ID: " + lessonId));
        lessonRepository.delete(lesson);
        return lesson;
    }

    public void markLessonCompleted(Long userId, Long lessonId, boolean completed) {
    UserLessonProgress progress = progressRepo.findByUserIdAndLessonId(userId, lessonId)
        .orElse(new UserLessonProgress());
    progress.setUserId(userId);
    progress.setLesson(lessonRepository.findById(lessonId).orElseThrow());
    progress.setCompleted(completed);
    progressRepo.save(progress);
}

//getCompletedLessonIds
public List<Long> getCompletedLessonIds(Long userId, Long planId) {
    return progressRepo.findCompletedLessonIdsByUserIdAndPlanId(userId, planId);
}

//getUpvotedPlansByUser
    public List<LearningPlan> getUpvotedPlansByUser(Long userId) {
        User user = userRepository.findById(userId.intValue())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return new ArrayList<>(user.getUpvotedPlans());  // assuming getUpvotedPlans() exists
    }

    // getStartedPlansByUser
    public List<LearningPlan> getStartedPlansByUser(Long userId) {
        User user = userRepository.findById(userId.intValue())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        return new ArrayList<>(user.getStartedPlans());
    }

    // startLearningPlan
    public void startLearningPlan(Long userId, Long planId) {
        User user = userRepository.findById(userId.intValue())
            .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        LearningPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Learning plan not found with ID: " + planId));

        if (!user.getStartedPlans().contains(plan)) {
            user.getStartedPlans().add(plan);
            userRepository.save(user);
        }
    }

    //finish a learning plan
    public void finishLearningPlan(Long userId, Long planId) {
        User user = userRepository.findById(userId.intValue())
            .orElseThrow(() -> new RuntimeException("User not found"));
        LearningPlan plan = planRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Plan not found"));

        // Remove from started plans if present
        if (user.getStartedPlans().contains(plan)) {
            user.getStartedPlans().remove(plan);
        }

        // Add to completed plans if not already present
        if (!user.getCompletedPlans().contains(plan)) {
            user.getCompletedPlans().add(plan);
        }

        userRepository.save(user);
    }

    //searchLearningPlans
    public List<LearningPlan> searchPlansByKeyword(String query) {
        return planRepository.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
    }
}
