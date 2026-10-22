package com.lastKings.ecom.inventory_management.security;

import com.lastKings.ecom.inventory_management.model.Users;
import com.lastKings.ecom.inventory_management.repository.UserRepo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.AbstractMap;
import java.util.Map;

@Component
public class SecurityUtils {
    private final UserRepo userRepo;

    public SecurityUtils(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    /**
     * Retrieves the current authenticated UserDetailsImpl from the SecurityContext.
     * This is the Spring Security principal object.
     * @return UserDetailsImpl if authenticated and principal is of type UserDetailsImpl, null otherwise.
     */
    public UserDetailsImpl getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserDetailsImpl) {
            return (UserDetailsImpl) authentication.getPrincipal();
        }
        return null;
    }

    /**
     * Retrieves the full Users entity for the currently authenticated user from the database.
     * @return Users entity if found, null otherwise.
     */
    public Users getCurrentUserEntity() {
        UserDetailsImpl userDetails = getCurrentUserDetails();
        if (userDetails != null) {
// Find the user entity by username from the database
            return userRepo.findByUsername(userDetails.getUsername()).orElse(null);
        }
        return null;
    }

    /**
     * Retrieves the userId and username of the current authenticated user.
     * Provides "System" as username and null for userId if no user is authenticated
     * or user entity cannot be found.
     * @return A Map.Entry where key is userId (Long) and value is username (String).
     */
    public Map.Entry<Long,String> getUserIdAndUsername() {
        Users currentUser = getCurrentUserEntity();
        Long userId = (currentUser != null) ? currentUser.getId() : null;
        String username = (currentUser != null) ? currentUser.getUsername() : "System";
        return new AbstractMap.SimpleEntry<>(userId, username);
    }
}

