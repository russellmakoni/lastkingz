package com.lastKings.ecom.inventory_management.event;


import com.lastKings.ecom.inventory_management.model.Items;

import java.time.LocalDateTime;

public class ItemCreatedEvent extends BaseInventoryEvent{

    private final Items createdItem;
    public ItemCreatedEvent(Object source, Items createdItem, Long userId, String username) {
        super(source,userId,username);
        this.createdItem = createdItem;
    }
    public Items getCreatedItem() {
        return createdItem;
    }

    @Override
    public String getEventType() {
        return "Item_Created";
    }

    @Override
    public String getEventDescription() {
        return String.format("Added: %s(ID: %d,Barcode: %s). Quantity added: %d, Priced at :%.2f",
                createdItem.getItemName(),
                createdItem.getItemID(),
                createdItem.getItemBarcode(),
                createdItem.getItemQuantity(),
                createdItem.getItemPrice());
    }
}
