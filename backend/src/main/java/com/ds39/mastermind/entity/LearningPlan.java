package com.ds39.mastermind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.JoinTable;
import jakarta.persistence.JoinColumn;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.HashSet;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor //?
@AllArgsConstructor //?
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private Long createdByUserId;
    private int upvotes = 0;

    @OneToMany(mappedBy = "plan", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Lesson> lessons;

    @ManyToMany
    @JsonIgnore
    @JoinTable(
        name = "user_upvoted_plans",
        joinColumns = @JoinColumn(name = "plan_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> upvotedByUsers = new HashSet<>();

    @ManyToMany(mappedBy = "startedPlans")
    @JsonIgnore
    private Set<User> startedByUsers = new HashSet<>();
    
}
