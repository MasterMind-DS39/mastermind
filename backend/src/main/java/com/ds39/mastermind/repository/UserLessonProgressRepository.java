package com.ds39.mastermind.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ds39.mastermind.entity.UserLessonProgress;
import java.util.List;
import java.util.Optional;

public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {
    @Query("""
        SELECT p.lesson.id FROM UserLessonProgress p
        WHERE p.userId = :userId AND p.lesson.plan.id = :planId AND p.completed = true
    """)
    List<Long> findCompletedLessonIdsByUserIdAndPlanId(@Param("userId") Long userId, @Param("planId") Long planId);
    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
}