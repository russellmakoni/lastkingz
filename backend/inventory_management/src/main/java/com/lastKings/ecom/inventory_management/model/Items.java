package com.lastKings.ecom.inventory_management.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;


@Setter
@Getter

@Entity
@Table
@Data
@NoArgsConstructor
public class Items {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long itemID;

    @Column(nullable = false)
    private String itemName;

    @Column(unique = true)
    private String itemBarcode;

  private String itemDescription;

   private String itemCategory;

    @Column(nullable = false)
   private BigDecimal itemPrice;

    @Column(nullable = false)
    private Integer itemQuantity;

}
