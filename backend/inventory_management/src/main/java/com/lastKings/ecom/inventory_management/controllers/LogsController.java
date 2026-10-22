package com.lastKings.ecom.inventory_management.controllers;

import com.lastKings.ecom.inventory_management.model.LogEntry;
import com.lastKings.ecom.inventory_management.service.LogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/logs")
public class LogsController {
    private final LogService logService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<LogEntry>> getAllAuditLogs() {
        List<LogEntry> logs = logService.getAllLogEntries();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/sales")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<LogEntry>> getSaleAuditLogs() {
        List<LogEntry> logs = logService.getSalesLogs();
        return ResponseEntity.ok(logs);
    }
    @GetMapping("/items")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<LogEntry>> getItemAuditLogs() {
        List<LogEntry> logs = logService.getItemlogs();
        return ResponseEntity.ok(logs);
    }


}