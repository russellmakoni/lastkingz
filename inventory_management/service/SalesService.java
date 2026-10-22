package com.lastKings.ecom.inventory_management.service;

import com.lastKings.ecom.inventory_management.event.SalesRecordEvent;
import com.lastKings.ecom.inventory_management.model.Items;
import com.lastKings.ecom.inventory_management.model.Sales;
import com.lastKings.ecom.inventory_management.model.Users;

import com.lastKings.ecom.inventory_management.repository.ItemsRepo;
import com.lastKings.ecom.inventory_management.repository.SalesRepo;
import com.lastKings.ecom.inventory_management.repository.UserRepo;
import com.lastKings.ecom.inventory_management.security.SecurityUtils;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SalesService {

    private final SalesRepo salesRepo;
    private final ItemsRepo itemsRepo;

    private final UserRepo userRepo; // Still needed for Sales.setUser(currentUser) if currentUser is a full Users object
    private final ApplicationEventPublisher eventPublisher;
    private final SecurityUtils securityUtils; // Inject SecurityUtils

    // Adjusted constructor
    public SalesService(SalesRepo salesRepo, ItemsRepo itemsRepo, UserRepo userRepo, ApplicationEventPublisher eventPublisher, SecurityUtils securityUtils) {
        this.salesRepo = salesRepo;
        this.itemsRepo = itemsRepo;
        this.userRepo = userRepo; // Keep this if Sales.setUser expects a full Users object
        this.eventPublisher = eventPublisher;
        this.securityUtils = securityUtils; // Initialize SecurityUtils
    }

    @Transactional
    public Sales recordSale(Long itemID, Integer itemQuantity) {
// Use SecurityUtils to get user info for logging
        Map.Entry<Long,String> userDetails = securityUtils.getUserIdAndUsername();
        Long userId = userDetails.getKey();
        String username = userDetails.getValue();
        Users currentUser = securityUtils.getCurrentUserEntity(); // Get the full user entity
        Optional<Items> itemOptional = itemsRepo.findById(itemID);
        if (itemOptional.isEmpty()) {
            throw new RuntimeException("Item not found with ID: " + itemID);
        }
        Items item = itemOptional.get();
        if (item.getItemQuantity() < itemQuantity) {
            throw new RuntimeException("Not enough stock for item: " + item.getItemName() + ". Available: " + item.getItemQuantity());
        }
        Sales sale = new Sales();
        sale.setItems(item);
        sale.setQuantitySold(itemQuantity);
        sale.setPrice(item.getItemPrice());
        sale.setSalesDate(LocalDateTime.now());
        sale.setUser(currentUser); // Link sale to the full user entity
        int oldQuantity = item.getItemQuantity();
        item.setItemQuantity(item.getItemQuantity() - itemQuantity);
        itemsRepo.save(item);
        Sales savedSale = salesRepo.save(sale);
        eventPublisher.publishEvent(new SalesRecordEvent(this, item, itemQuantity, item.getItemPrice(), userId, username));
        return savedSale;
    }

    @Transactional(readOnly = true)
    public List<Sales> getAllSales() {
        return salesRepo.findAll();
    }
}