package com.ds39.mastermind.entity;

import jakarta.persistence.*;

@Entity(name = "SavedPost")
public class SavedPost {
    @Id
    @GeneratedValue
    private int id;

    private String userId;
    private String postId;

    public SavedPost() {}

    public SavedPost(String userId, String postId) {
        this.userId = userId;
        this.postId = postId;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }
}
