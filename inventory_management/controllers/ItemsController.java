package com.lastKings.ecom.inventory_management.controllers;


import com.lastKings.ecom.inventory_management.event.ItemCreatedEvent;
import com.lastKings.ecom.inventory_management.event.ItemDeletedEvent;
import com.lastKings.ecom.inventory_management.event.ItemUpdatedEvent;
import com.lastKings.ecom.inventory_management.model.Items;

import com.lastKings.ecom.inventory_management.repository.ItemsRepo;


import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map; // Import Map for Map.Entry
import java.util.Optional;
import com.lastKings.ecom.inventory_management.security.SecurityUtils;

@CrossOrigin(origins = "http://localhost:3000", maxAge = 3600)
@RestController
@RequestMapping("/api/items")
public class ItemsController {

    private final ItemsRepo itemsRepo;
    private final ApplicationEventPublisher eventPublisher;
    private final SecurityUtils securityUtils; // Inject SecurityUtils

    // Adjusted constructor
    public ItemsController(ItemsRepo itemsRepo, ApplicationEventPublisher eventPublisher, SecurityUtils securityUtils) {
        this.itemsRepo = itemsRepo;
        this.eventPublisher = eventPublisher;
        this.securityUtils = securityUtils; // Initialize SecurityUtils
    }

// Removed the private getCurrentUser() method from here

    @GetMapping
    public ResponseEntity getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category) {

        Pageable pageable = PageRequest.of(page, size);
        Page itemsPage;

        if (search != null && !search.isEmpty()) {
            itemsPage = itemsRepo.findByItemNameContainingIgnoreCaseOrItemBarcodeContainingIgnoreCase(search, search, pageable);
        } else if (category != null && !category.isEmpty()) {
            itemsPage = itemsRepo.findByItemCategoryIgnoreCase(category, pageable);
        } else {
            itemsPage = itemsRepo.findAll(pageable);
        }
        return ResponseEntity.ok(itemsPage);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<Items> getItemById(@PathVariable("id") Long id) {
        Optional<Items> itemData = itemsRepo.findById(id);
        return itemData.map(item -> new ResponseEntity<>(item, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity createItem( @RequestBody Items item) {
// Use SecurityUtils to get user info
        Map.Entry<Long,String> userDetails = securityUtils.getUserIdAndUsername();
        Long userId = userDetails.getKey();
        String username = userDetails.getValue();

        try {
            Items savedItem = itemsRepo.save(item);
            eventPublisher.publishEvent(new ItemCreatedEvent(this, savedItem, userId, username));
            return new ResponseEntity<>(savedItem, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Items> updateItem(@PathVariable("id") Long id,@RequestBody Items item) {
// Use SecurityUtils to get user info
        Map.Entry<Long,String> userDetails = securityUtils.getUserIdAndUsername();
        Long userId = userDetails.getKey();
        String username = userDetails.getValue();

        Optional <Items> itemData = itemsRepo.findById(id);

        if (itemData.isPresent()) {
            Items updatedItem = itemData.get(); // Get a copy of the item BEFORE update for logging old value
            
            Items oldItem = new Items();
            oldItem.setItemName(updatedItem.getItemName());
            oldItem.setItemBarcode(updatedItem.getItemBarcode());
            oldItem.setItemDescription(updatedItem.getItemDescription());
            oldItem.setItemCategory(updatedItem.getItemCategory());
            oldItem.setItemPrice(updatedItem.getItemPrice());
            oldItem.setItemQuantity(updatedItem.getItemQuantity());
            
            updatedItem.setItemName(item.getItemName());
            updatedItem.setItemBarcode(item.getItemBarcode());
            updatedItem.setItemDescription(item.getItemDescription());
            updatedItem.setItemCategory(item.getItemCategory());
            updatedItem.setItemPrice(item.getItemPrice());
            updatedItem.setItemQuantity(item.getItemQuantity());
            // Save the updated item
                itemsRepo.save(updatedItem);
            eventPublisher.publishEvent(new ItemUpdatedEvent(this, oldItem,updatedItem, userId, username));
            return new ResponseEntity<>(updatedItem, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity <Void> deleteItem(@PathVariable("id") Long id) {
// Use SecurityUtils to get user info
        Map.Entry<Long,String> userDetails = securityUtils.getUserIdAndUsername();
        Long userId = userDetails.getKey();
        String username = userDetails.getValue();

        Optional <Items> itemData = itemsRepo.findByItemID(id);
        String itemName = itemData.isPresent() ? itemData.get().getItemName() : "Unknown Item";

        try {
            itemsRepo.deleteById(id);
           eventPublisher.publishEvent(new ItemDeletedEvent(this, id, itemName, userId, username));
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}