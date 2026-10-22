package com.lastKings.ecom.inventory_management.event;

import com.lastKings.ecom.inventory_management.model.LogEntry;
import com.lastKings.ecom.inventory_management.repository.LogRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Component
public class LOgEvent {
    private static final Logger logger = LoggerFactory.getLogger(LOgEvent.class);
    private final LogRepo logRepo;

    @EventListener
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void handleEvent(BaseInventoryEvent event){
        logger.info("AUDIT_LOG - {}",event.toString());
        String category;
        if (event instanceof ItemCreatedEvent || event instanceof ItemUpdatedEvent || event instanceof ItemDeletedEvent) {
            category = "ITEM";
        } else if (event instanceof SalesRecordEvent) {
            category = "SALE";
        } else {
            category = "UNKNOWN"; // Fallback for any other BaseInventoryEvent types
        }

        LogEntry logEntry = new LogEntry(
                event.getEventType(),
                event.getEventTime(),
                event.getUserId(),
                event.getUsername(),
                event.getEventDescription(),
                event.getSource().getClass().getSimpleName(),
                category
        );
        try {
            logRepo.save(logEntry);
            logger.debug("Audit log entry saved to DB: {}", logEntry.getId());
        }
        catch (Exception e) {
            logger.error("Failed to save audit log entry to DB: {}", logEntry.toString(), e);
        }

    }
}
