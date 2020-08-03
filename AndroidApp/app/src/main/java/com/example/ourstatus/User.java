package com.example.ourstatus;

import java.util.List;

public class User {
    private String firstName, lastName, eMail, username;
    private List<String> friends, groupIds;

    public User(String firstName, String lastName, String eMail, String username, List<String> friends, List<String> groupIds) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.eMail = eMail;
        this.username = username;
        this.friends = friends;
        this.groupIds = groupIds;
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

    public String geteMail() {
        return eMail;
    }

    public void seteMail(String eMail) {
        this.eMail = eMail;
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
}
