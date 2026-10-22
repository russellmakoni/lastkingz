package com.lastKings.ecom.inventory_management.Exception;


public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message){
        super(message);
    }
}
