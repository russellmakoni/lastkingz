package com.lastKings.ecom.inventory_management.controllers;

import com.lastKings.ecom.inventory_management.model.Sales;
import com.lastKings.ecom.inventory_management.service.SalesService; // Import SalesService
 // Keep if you use validation on parameters, though less common than on @RequestBody
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/sales")
public class SalesController {

    private final SalesService salesService; // Inject SalesService

    public SalesController(SalesService salesService) { // Updated constructor
        this.salesService = salesService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<?> recordSale(
            @RequestParam Long itemID,
            @RequestParam Integer itemQuantity) {
        try {
            Sales savedSale = salesService.recordSale(itemID, itemQuantity);
            return new ResponseEntity<>(savedSale, HttpStatus.CREATED);
        } catch (RuntimeException e) { // Catch RuntimeException for stock/not found errors from service
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST); // Return error message
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<Sales>> getAllSales() {
        List<Sales> salesList = salesService.getAllSales();
       return new ResponseEntity<>(salesList, HttpStatus.OK);

    }
}