package com.lastKings.ecom.inventory_management.event;

import com.lastKings.ecom.inventory_management.model.Items;
import lombok.Getter;

import java.util.Objects;

@Getter
public class ItemUpdatedEvent extends BaseInventoryEvent{

    private final Items oldItem;
    private final Items updatedItem;

    public ItemUpdatedEvent(Object source, Items oldItem, Items updatedItem, Long userId, String username) {
        super(source, userId, username);
        this.oldItem = oldItem;
        this.updatedItem = updatedItem;

    }

    public Items getOldItem() {
        return oldItem;
    }

    public Items getUpdatedItem() {
        return updatedItem;
    }

    @Override
    public String getEventType() {
        return "Item_Updated";
    }

    @Override
    public String getEventDescription() {
        StringBuilder details = new StringBuilder(String.format("Item '%s'(ID:%d) updated. Changes:", updatedItem.getItemName(), updatedItem.getItemID()));
        if(!oldItem.getItemName().equals(updatedItem.getItemName())){
          details.append(String.format(" Name: '%s'->'%s'",oldItem.getItemName(), updatedItem.getItemName()));
        }
        if(!oldItem.getItemBarcode().equals(updatedItem.getItemBarcode())){
            details.append(String.format("Barcode:'%s'->'%s'",oldItem.getItemBarcode(), updatedItem.getItemBarcode()));
        }
        if (!oldItem.getItemDescription().equals(updatedItem.getItemDescription())){
            details.append("Description changed;");
        }
        if (!oldItem.getItemCategory().equals(updatedItem.getItemCategory())){
            details.append(String.format("Category:'%s'->'%s'",oldItem.getItemCategory(), updatedItem.getItemCategory()));
        }
        if(oldItem.getItemPrice().compareTo(updatedItem.getItemPrice())!=0){
            details.append(String.format("Price:%.2f->%.2f;",oldItem.getItemPrice(), updatedItem.getItemPrice()));
        }
        if (!Objects.equals(oldItem.getItemQuantity(), updatedItem.getItemQuantity())){
            details.append(String.format("Quantity:%d->%d;",oldItem.getItemQuantity(), updatedItem.getItemQuantity()));
        }
return details.toString();
    }

}
