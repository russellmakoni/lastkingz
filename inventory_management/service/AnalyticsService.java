package com.lastKings.ecom.inventory_management.service;

import com.lastKings.ecom.inventory_management.repository.SalesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    @Autowired
    private SalesRepo salesRepo;

    public List<Map<String, Object>> getDailyTrends() {
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime sevenDaysAgo = today.minusDays(7);
        return salesRepo.findDailySalesBetween(sevenDaysAgo, today);
    }
    public List<Map<String, Object>> getWeeklyTrends() {
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime fourWeeksAgo = today.minusWeeks(4);
        return salesRepo.findWeeklySalesBetween(fourWeeksAgo, today);
    }
    public List<Map<String, Object>> getMonthlyTrends() {
        LocalDateTime today = LocalDateTime.now();
        LocalDateTime oneYearAgo = today.minusYears(1);
        return salesRepo.findMonthlySalesBetween(oneYearAgo, today);
    }


}
