package com.example.ourstatus;

import com.google.firebase.Timestamp;

public class Comments{
    String author, content, taskId;
    Timestamp date;

    public Comments() {
    }

    public Comments(String author, String content, String taskId, Timestamp date) {
        this.author = author;
        this.content = content;
        this.taskId = taskId;
        this.date = date;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
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
