package com.ds39.mastermind.repository;

import com.ds39.mastermind.entity.Lesson; 
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonRepository extends JpaRepository<Lesson, Long> {


}
