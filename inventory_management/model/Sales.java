package com.lastKings.ecom.inventory_management.model;

import jakarta.persistence.*;
import lombok.Data;


import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table
public class Sales {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sale_id;

    @ManyToOne(fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JoinColumn(name = "itemID", nullable = false)
    private Items items;
    @Column(nullable = false)
    private Integer quantitySold;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private LocalDateTime salesDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "users_id", nullable = false)
    private Users user;



    public Sales() {
    }

    public Sales(Long sale_id, Items items, Integer quantitySold, BigDecimal price, LocalDateTime salesDate) {
        this.sale_id = sale_id;
        this.items = items;
        this.quantitySold = quantitySold;
        this.price = price;
        this.salesDate = salesDate;
    }
}
