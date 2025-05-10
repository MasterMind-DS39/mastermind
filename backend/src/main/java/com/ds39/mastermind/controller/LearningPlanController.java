package com.ds39.mastermind.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;


import com.ds39.mastermind.entity.*;
import com.ds39.mastermind.service.*;
import java.util.List;


@RestController
@RequestMapping("/api/plans")
public class LearningPlanController {

    private final LearningPlanService planService;
    

    public LearningPlanController(LearningPlanService planService) {
        this.planService = planService;
    }



    @PostMapping("/{userID}")
    public ResponseEntity<LearningPlan> createPlan(@PathVariable Long userID, @RequestBody LearningPlan plan) {
        LearningPlan createdPlan = planService.createLearningPlan(userID, plan);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPlan);
    }

    @GetMapping("/{planID}")
    public ResponseEntity<LearningPlan> getPlanByID(@PathVariable long planID) {
        LearningPlan foundPlan = planService.getLearningPlan(planID);
        return ResponseEntity.ok(foundPlan);
    }

    @PutMapping("/{planID}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable long planID, @RequestBody LearningPlan plan) {
        LearningPlan updatedPlan = planService.updateLearningPlan(planID, plan);
        return ResponseEntity.ok(updatedPlan);
    }

    //deleteLearningPlan
    @DeleteMapping("/{planID}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable long planID) {
        planService.deleteLearningPlan(planID);
        return ResponseEntity.noContent().build();
    }

    //getAllLearningPlans
    @GetMapping("/all")
    public ResponseEntity<List<LearningPlan>> getAllLearningPlans() {
        return ResponseEntity.ok(planService.getAllLearningPlans());
    }

    //getAllLearningPlansByUserID
    @GetMapping("/user/{userID}")
    public ResponseEntity<List<LearningPlan>> getAllLearningPlansByUserID(@PathVariable Long userID) {
        return ResponseEntity.ok(planService.getAllLearningPlansByUserId(userID));
    }

    //upvoteLearningPlan
    @PutMapping("/upvote/{planID}")
    public ResponseEntity<LearningPlan> upvoteLearningPlan(@PathVariable Long planID, @RequestParam Long userID) {
        return ResponseEntity.ok(planService.upvoteLearningPlan(planID, userID));
    }

    //handleDownvote
    @PutMapping("/downvote/{planID}")
    public ResponseEntity<LearningPlan> removeUpvoteFromLearningPlan(@PathVariable Long planID, @RequestParam Long userID) {
        return ResponseEntity.ok(planService.removeUpvoteFromLearningPlan(planID, userID));
    }

    //deleteIndividualLesson
    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<Void> deleteLesson(@PathVariable long lessonId) {
        planService.deleteLesson(lessonId);
        return ResponseEntity.noContent().build();
    }
//LearningPlanProgress
    @PutMapping("/progress")
    public ResponseEntity<?> updateLessonProgress(@RequestParam Long userId, @RequestParam Long lessonId, @RequestParam boolean completed) {
        planService.markLessonCompleted(userId, lessonId, completed);
        return ResponseEntity.ok().build();
}

    //getLearningPlansUpvotedByUser
    @GetMapping("/user/{userId}/upvoted-plans")
    public ResponseEntity<List<LearningPlan>> getUpvotedPlansByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(planService.getUpvotedPlansByUser(userId));
    }

    //learningPlanProgressGetting
    @GetMapping("/progress")
    public ResponseEntity<List<Long>> getLessonProgress(@RequestParam Long userId, @RequestParam Long planId) {
        return ResponseEntity.ok(planService.getCompletedLessonIds(userId, planId));
    }

    @GetMapping("/started/{userId}")
    public ResponseEntity<List<LearningPlan>> getStartedPlansByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(planService.getStartedPlansByUser(userId));
    }

    @PutMapping("/start/{userId}/{planId}")
    public ResponseEntity<?> startLearningPlan(@PathVariable Long userId, @PathVariable Long planId) {
        planService.startLearningPlan(userId, planId);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/finish/{userId}/{planId}")
    public ResponseEntity<?> finishLearningPlan(@PathVariable Long userId, @PathVariable Long planId) {
        planService.finishLearningPlan(userId, planId);
        return ResponseEntity.ok().build();
}

    @PutMapping("/complete/{userId}/{planId}")
    public ResponseEntity<?> completeLearningPlan(@PathVariable Long userId, @PathVariable Long planId) {
        planService.finishLearningPlan(userId, planId);
        return ResponseEntity.ok().build();
    }

    // Get all completed plans by user
    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<List<LearningPlan>> getCompletedPlansByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(planService.getCompletedPlansByUser(userId));
    }

    //searchLearningPlans
    @GetMapping("/search")
    public ResponseEntity<List<LearningPlan>> searchPlans(@RequestParam String query) {
        return ResponseEntity.ok(planService.searchPlansByKeyword(query));
    }


}
