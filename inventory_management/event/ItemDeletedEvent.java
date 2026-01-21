package com.lastKings.ecom.inventory_management.event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemDeletedEvent extends BaseInventoryEvent{

    private final Long deletedItemId;
    private final String deletedItemName;

    public ItemDeletedEvent(Object source, Long deletedItemId, String deletedItemName, Long userId, String username) {
        super(source, userId, username);
        this.deletedItemId = deletedItemId;
        this.deletedItemName = deletedItemName;
    }

    public Long getDeletedItemId() {
        return deletedItemId;
    }

    public String getDeletedItemName() {
        return deletedItemName;
    }

    @Override
    public String getEventType() {
        return "Item_Deleted";
    }

    @Override
    public String getEventDescription() {
        return String.format("Item '%s' (ID: %d) was deleted.", deletedItemName, deletedItemId);
    }



}
