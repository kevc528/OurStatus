package com.example.ourstatus;

import com.google.firebase.Timestamp;

public class Comments{
    String authorId, content, taskId;
    Timestamp date;

    public Comments() {
    }

    public Comments(String authorId, String content, String taskId, Timestamp date) {
        this.authorId = authorId;
        this.content = content;
        this.taskId = taskId;
        this.date = date;
    }

    public String getAuthorId() {
        return authorId;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

}
