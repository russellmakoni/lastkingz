package com.lastKings.ecom.inventory_management.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class SalesDTO {

    private Long itemID;
    private Integer itemQuantity;
}
