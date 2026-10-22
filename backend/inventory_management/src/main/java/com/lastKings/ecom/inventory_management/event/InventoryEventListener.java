package com.lastKings.ecom.inventory_management.event;

import com.lastKings.ecom.inventory_management.model.Items;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class InventoryEventListener {
    private static final Logger logger = LoggerFactory.getLogger(InventoryEventListener.class);

    /**
     * Listens for any BaseInventoryEvent and logs its details.
     * This single method can handle all events that extend BaseInventoryEvent.
     *
     * @param event The BaseInventoryEvent that was published.
     */
    @EventListener
    public void handleInventoryEvent(BaseInventoryEvent event) {
        // Log the event details. You can customize the log format.
        // For example, you might save this to a database table for auditing.
        logger.info("AUDIT_LOG - {}", event.toString());

        // You could also have specific handlers for different event types if needed:
        if (event instanceof ItemCreatedEvent itemCreatedEvent) {
            logger.info("Item Creation Audit: User '{}' created item '{}' (ID: {})",
                    itemCreatedEvent.getUsername(),
                    itemCreatedEvent.getCreatedItem().getItemName(),
                    itemCreatedEvent.getCreatedItem().getItemID());
        } else if (event instanceof ItemUpdatedEvent) {
            ItemUpdatedEvent itemUpdatedEvent = (ItemUpdatedEvent) event;
            Items oldItem = ((ItemUpdatedEvent) event).getOldItem();
            Items updatedItem = ((ItemUpdatedEvent) event).getUpdatedItem();
            System.out.println(oldItem.getItemPrice()+"->"+updatedItem.getItemPrice());
            logger.info("Item Update Audit: User '{}' updated item '{}' (ID: {}). Details: {}",
                    itemUpdatedEvent.getUsername(),
                    itemUpdatedEvent.getUpdatedItem().getItemName(),
                    itemUpdatedEvent.getUpdatedItem().getItemID(),
                    itemUpdatedEvent.getEventDescription());
        } else if (event instanceof ItemDeletedEvent ) {
            ItemDeletedEvent itemDeletedEvent = (ItemDeletedEvent) event;
            logger.warn("Item Deletion Audit: User '{}' deleted item '{}' (ID: {}).", // Use warn for deletions
                    itemDeletedEvent.getUsername(),
                    itemDeletedEvent.getDeletedItemName(),
                    itemDeletedEvent.getDeletedItemId());
        } else if (event instanceof SalesRecordEvent) {
            SalesRecordEvent salesRecordEvent = (SalesRecordEvent) event;
            logger.info("Sale Transaction Audit: User '{}' recorded sale of {} units of '{}' (ID: {}).",
                    salesRecordEvent.getUsername(),
                    salesRecordEvent.getQuantitySold(),
                    salesRecordEvent.getSoldItem().getItemName(),
                    salesRecordEvent.getSoldItem().getItemID());
        }
    }
}



