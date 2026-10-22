package com.lastKings.ecom.inventory_management.controllers;

import com.lastKings.ecom.inventory_management.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping ("/api/analytics")
public class AnalyticsCcontroller {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/trends/daily") public List<Map<String, Object>> getDailyTrends() {
        return analyticsService.getDailyTrends();
    }
    @GetMapping("/trends/weekly")
    public List<Map<String, Object>> getWeeklyTrends() {
        return analyticsService.getWeeklyTrends();
    }
    @GetMapping("/trends/monthly")
    public List<Map<String, Object>> getMonthlyTrends() {
        return analyticsService.getMonthlyTrends();
    }


}
