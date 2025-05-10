package com.ds39.mastermind.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.Id;
//import com.ds39.mastermind.entity.User;
import jakarta.persistence.JoinColumn;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserLessonProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*@ManyToOne
    private User user;*/

    private Long userId; //change these when the user is added

    @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference
    private Lesson lesson;

    private boolean completed;
}
