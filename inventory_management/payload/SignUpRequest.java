package com.lastKings.ecom.inventory_management.payload;

import jakarta.persistence.Column;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Setter
@Getter
@Data
public class SignUpRequest {

    private String username;
    private String password;

    private Set<String> role;

    public SignUpRequest(String username, String password, Set<String> role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public SignUpRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRole() {
        return role;
    }

    public void setRole(Set<String> role) {
        this.role = role;
    }
}
