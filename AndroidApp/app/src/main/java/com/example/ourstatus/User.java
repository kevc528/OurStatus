package com.example.ourstatus;

public class User {
    private String firstName, lastName, eMail, username;
    private String[] friends, groupIds;

    public User(String firstName, String lastName, String eMail, String username, String[] friends, String[] groupIds) {
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

    public String[] getFriends() {
        return friends;
    }

    public void setFriends(String[] friends) {
        this.friends = friends;
    }

    public String[] getGroupIds() {
        return groupIds;
    }

    public void setGroupIds(String[] groupIds) {
        this.groupIds = groupIds;
    }
}
