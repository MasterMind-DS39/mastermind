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
    public LearningPlan createPlan(@PathVariable Long userID , @RequestBody LearningPlan plan) {
        // Call the service to create a learning plan
        return planService.createLearningPlan(userID, plan);

    }

    @GetMapping("/{planID}")
    public LearningPlan getPlanByID(@PathVariable long planID){
        return planService.getLearningPlan(planID);

    
    }

    @PutMapping("/{planID}")
    public LearningPlan updateLearningPlan(@PathVariable long planID, @RequestBody LearningPlan plan){

        return planService.updateLearningPlan(planID, plan);


    }

    //deleteLearningPlan
    @DeleteMapping("/{planID}")
    public void deleteLearningPlan(@PathVariable long planID){
        planService.deleteLearningPlan(planID);
    }

    //getAllLearningPlans
    @GetMapping("/all")
    public List<LearningPlan> getAllLearningPlans() {
        return planService.getAllLearningPlans();
    }

    //getAllLearningPlansByUserID
    @GetMapping("/user/{userID}")
    public List<LearningPlan> getAllLearningPlansByUserID(@PathVariable Long userID) {
        return planService.getAllLearningPlansByUserId(userID);
    }

    //upvoteLearningPlan
    @PutMapping("/upvote/{planID}")
    public LearningPlan upvoteLearningPlan(@PathVariable Long planID) {
        return planService.upvoteLearningPlan(planID);
    }

    //deleteIndividualLesson
    @DeleteMapping("/lessons/{lessonId}")
    public void deleteLesson(@PathVariable long lessonId) {
        planService.deleteLesson(lessonId);
}
//LearningPlanProgress
    @PutMapping("/progress")
    public ResponseEntity<?> updateLessonProgress(@RequestParam Long userId, @RequestParam Long lessonId, @RequestParam boolean completed) {
    planService.markLessonCompleted(userId, lessonId, completed);
    return ResponseEntity.ok().build();
}

    //learningPlanProgressGetting
    @GetMapping("/progress")
    public List<Long> getLessonProgress(@RequestParam Long userId, @RequestParam Long planId) {
        return planService.getCompletedLessonIds(userId, planId); // This should return a list of completed lesson IDs
    }


}
