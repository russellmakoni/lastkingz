package com.lastKings.ecom.inventory_management.service;

import com.lastKings.ecom.inventory_management.model.LogEntry;
import com.lastKings.ecom.inventory_management.repository.LogRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LogService {

private final LogRepo logRepo;

public LogService(LogRepo logRepo){
    this.logRepo=logRepo;
}
    public List<LogEntry> getAllLogEntries() {
    return logRepo.findByOrderByTimestampDesc();
    }
    public List<LogEntry> getItemlogs(){
    return logRepo.findByCategoryOrderByTimestampDesc("ITEM");
    }
    public List<LogEntry> getSalesLogs(){
    return logRepo.findByCategoryOrderByTimestampDesc("SALE");
    }
}
