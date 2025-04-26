package com.ds39.mastermind.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)//?
    private Long id;

    private String url;

    @ManyToOne
    @JsonBackReference
    private Lesson lesson;

    // Getters and Setters
}
