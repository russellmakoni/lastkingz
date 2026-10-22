package com.lastKings.ecom.inventory_management.service;

import com.lastKings.ecom.inventory_management.model.Items;
import com.lastKings.ecom.inventory_management.repository.ItemsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemsRepo itemsRepo;

    public List<Items> getAllItems() {
        return itemsRepo.findAll();
    }
    public Optional<Items> getItemById(Long itemID) {
      return itemsRepo.findById(itemID);
    }
    public Optional<Items> getItemByItemName(String itemName) {
        return itemsRepo.findByItemName(itemName);
    }
    public Optional <Items> getItemByBarcode(String itemBarcode){
        return itemsRepo.findByItemBarcode(itemBarcode);
    }
    public Items addItem(Items item) {
        return itemsRepo.save(item);
    }
    public Optional<Items> updateItem(  Long  itemID, Items item) {
        return itemsRepo.findByItemID(itemID).map(items -> {
            items.setItemName(item.getItemName());
            if (item.getItemBarcode() != null && !item.getItemBarcode().equals(items.getItemBarcode())) {
                if (itemsRepo.findByItemBarcode(item.getItemBarcode()).isPresent()) {
                    throw new RuntimeException("Another item with this barcode already exists.");
                }
            }
            items.setItemBarcode(item.getItemBarcode());
            items.setItemDescription(item.getItemDescription());
            items.setItemCategory(item.getItemCategory());
            items.setItemPrice(item.getItemPrice());
            items.setItemQuantity(item.getItemQuantity());
            return itemsRepo.save(items);
        });
    }

    public boolean deleteItem(Long itemID) {
        return itemsRepo.findById(itemID).map(items -> {
            itemsRepo.delete(items);
            return true;
        }).orElse(false);
    }
    }


