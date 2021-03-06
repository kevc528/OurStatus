package com.example.ourstatus;

import com.google.firebase.Timestamp;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class Tasks implements Comparable<Tasks> {
    private List<String> assignees, comments, likedUsers;
    private String creatorId, id, title;
    private Timestamp dateCompleted, dateCreated, targetDate;
    private int level, likes;
    private boolean remind;

    public Tasks() {
    }

    public Tasks(List<String> assignees, String creatorId, String id, String title, Timestamp dateCompleted, Timestamp dateCreated, Timestamp targetDate, int level, boolean remind, List<String> comments, List<String> likedUsers, int likes) {
        this.assignees = assignees;
        this.creatorId = creatorId;
        this.id = id;
        this.title = title;
        this.dateCompleted = dateCompleted;
        this.dateCreated = dateCreated;
        this.targetDate = targetDate;
        this.level = level;
        this.remind = remind;
    }

    public List<String> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<String> assignees) {
        this.assignees = assignees;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Timestamp getDateCompleted() {
        return dateCompleted;
    }

    public void setDateCompleted(Timestamp dateCompleted) {
        this.dateCompleted = dateCompleted;
    }

    public Timestamp getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(Timestamp dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Timestamp getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(Timestamp targetDate) {
        this.targetDate = targetDate;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public boolean isRemind() {
        return remind;
    }

    public void setRemind(boolean remind) {
        this.remind = remind;
    }

    public List<String> getComments() {
        return comments;
    }

    public void setComments(List<String> comments) {
        this.comments = comments;
    }

    public List<String> getLikedUsers() {
        return likedUsers;
    }

    public void setLikedUsers(List<String> likedUsers) {
        this.likedUsers = likedUsers;
    }

    public int getLikes() {
        return likes;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }


    @Override
    public int compareTo(Tasks t) {
        Timestamp timeCreated = t.getTargetDate();
        return this.getTargetDate().compareTo(timeCreated);
    }
}
