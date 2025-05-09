package com.ds39.mastermind.repository;

import com.ds39.mastermind.entity.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
    List<LearningPlan> findByCreatedByUserId(Long userId);

    List<LearningPlan> findByStartedByUsers_Id(Long userId);

}
