package com.lastKings.ecom.inventory_management.payload;

import lombok.Data;

@Data
public class LoginRequest {

    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public LoginRequest() {
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
}
