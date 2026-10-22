package com.lastKings.ecom.inventory_management.repository;

import com.lastKings.ecom.inventory_management.model.Items;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ItemsRepo extends JpaRepository<Items, Long> {
    Optional<Items> findByItemName(String itemName);
    Optional<Items> findByItemBarcode(String itemBarcode);
    Optional<Items> findByItemCategory(String itemCategory);
    Optional <Items> findByItemID(Long itemID);
    Page<Items> findByItemNameContainingIgnoreCaseOrItemBarcodeContainingIgnoreCase(String itemName, String itemBarcode, Pageable pageable);
    Page<Items> findByItemCategoryIgnoreCase(String category, Pageable pageable);
    @Override
    Page<Items> findAll(Pageable pageable);

}
