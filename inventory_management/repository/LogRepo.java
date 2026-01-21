package com.lastKings.ecom.inventory_management.repository;

import com.lastKings.ecom.inventory_management.model.LogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LogRepo extends JpaRepository<LogEntry, Long> {
    List<LogEntry> findByCategoryOrderByTimestampDesc(String category);
    List<LogEntry> findByOrderByTimestampDesc();
}
