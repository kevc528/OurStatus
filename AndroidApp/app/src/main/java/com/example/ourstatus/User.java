package com.example.ourstatus;

import java.util.List;

public class User {
    private String firstName, lastName, email, username, id, picture;
    private List<String> friends, groupIds;

    public User() {
    }

    public User(String firstName, String lastName, String email, String username, List<String> friends, List<String> groupIds, String id, String picture) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
        this.friends = friends;
        this.groupIds = groupIds;
        this.id = id;
        this.picture = picture;
    }


    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getFriends() {
        return friends;
    }

    public void setFriends(List<String> friends) {
        this.friends = friends;
    }

    public List<String> getGroupIds() {
        return groupIds;
    }

    public void setGroupIds(List<String> groupIds) {
        this.groupIds = groupIds;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }
}
