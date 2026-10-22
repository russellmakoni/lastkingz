package com.lastKings.ecom.inventory_management.event;

import com.lastKings.ecom.inventory_management.model.Items;
import lombok.Getter;

import java.math.BigDecimal;
@Getter
public class SalesRecordEvent extends BaseInventoryEvent {

    private final Items soldItem; // The item that was sold
    private final Integer quantitySold;
    private final BigDecimal price;



    public SalesRecordEvent(Object source,Items soldItem, Integer quantitySold,BigDecimal price, Long userId, String username) {
        super(source, userId, username);
        this.soldItem = soldItem;
        this.quantitySold = quantitySold;
        this.price = price;

    }


    @Override
    public String getEventType() {
        return "SALE_RECORDED";
    }



    @Override
    public String getEventDescription() {
        return String.format("Sold %d units of '%s' (ID: %d, Barcode: %s) at %.2f per unit.",
                quantitySold,
                soldItem.getItemName(),
                soldItem.getItemID(),
                soldItem.getItemBarcode(),
                price

                );
    }
}
