package com.lastKings.ecom.inventory_management.Exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFOUND extends RuntimeException {
    public UserNotFOUND(String message) {
        super(message);
    }
}
