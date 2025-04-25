package com.ds39.mastermind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;

@Entity
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Long createdByUserId;
    private int upvotes = 0;

    @OneToMany(mappedBy = "plan", cascade = jakarta.persistence.CascadeType.ALL)
    private List<Lesson> lessons;

    // Getters and Setters
    
}
