package com.lastKings.ecom.inventory_management.repository;

import com.lastKings.ecom.inventory_management.model.ERole;
import com.lastKings.ecom.inventory_management.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    Optional<Role> findByName(ERole name);

}
