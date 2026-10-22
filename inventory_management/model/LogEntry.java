package com.lastKings.ecom.inventory_management.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "audit_logs")
public class LogEntry {
    // Getters and Setters (add getter/setter for category)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String eventType; // e.g., ITEM_CREATED, SALE_RECORDED

    @Column(nullable = false)
    private LocalDateTime timestamp;

    private Long userId;
    private String username;

    @Column(length = 1000)
    private String eventDetails;

    @Column(length = 255)
    private String sourceClass;

    // NEW SETTER
    // NEW GETTER
    @Column(nullable = false, length = 50) // NEW FIELD: Category (e.g., "ITEM", "SALE")
    private String category;

    // Constructors
    public LogEntry() {
    }

    // Updated constructor to include category
    public LogEntry(String eventType, LocalDateTime timestamp, Long userId, String username, String eventDetails, String sourceClass, String category) {
        this.eventType = eventType;
        this.timestamp = timestamp;
        this.userId = userId;
        this.username = username;
        this.eventDetails = eventDetails;
        this.sourceClass = sourceClass;
        this.category = category; // Initialize new field
    }

    @Override
    public String toString() {
        return "LogEntry{" +
                "id=" + id +
                ", eventType='" + eventType + '\'' +
                ", timestamp=" + timestamp +
                ", userId=" + userId +
                ", username='" + username + '\'' +
                ", eventDetails='" + eventDetails + '\'' +
                ", sourceClass='" + sourceClass + '\'' +
                ", category='" + category + '\'' + // Include in toString
                '}';
    }


}
