package com.lastKings.ecom.inventory_management.repository;

import com.lastKings.ecom.inventory_management.model.Sales;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface SalesRepo extends JpaRepository<Sales,Long> {

    @Query("SELECT FUNCTION('DATE_FORMAT', s.salesDate, '%Y-%m-%d') as date, sum(s.price) as total FROM Sales s WHERE s.salesDate BETWEEN :start AND :end GROUP BY date ORDER BY date")
    List<Map<String, Object>> findDailySalesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT FUNCTION('DATE_FORMAT', s.salesDate, '%Y-%u') as week, sum(s.price) as total FROM Sales s WHERE s.salesDate BETWEEN :start AND :end GROUP BY week ORDER BY week")
    List<Map<String, Object>> findWeeklySalesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT FUNCTION('DATE_FORMAT', s.salesDate, '%Y-%m') as month, sum(s.price) as total FROM Sales s WHERE s.salesDate BETWEEN :start AND :end GROUP BY month ORDER BY month")
    List<Map<String, Object>> findMonthlySalesBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

}
