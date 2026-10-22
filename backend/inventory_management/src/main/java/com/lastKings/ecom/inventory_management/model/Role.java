package com.lastKings.ecom.inventory_management.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING) @Column(length = 20)
    private ERole name;

    public Integer getId() {
        return id;
    }

    public Role() {
    }

    public Role(Integer id) {
        this.id = id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public Role(Integer id, ERole name) {
        this.id = id;
        this.name = name;
    }

    public void setName(ERole name) {
        this.name = name;
    }
}
