package com.lastKings.ecom.inventory_management.event;


import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;

import java.time.LocalDateTime;

@Getter
public abstract class BaseInventoryEvent extends ApplicationEvent {

    private final Long userId;
    private final String username;
    private final LocalDateTime eventTime;

    public BaseInventoryEvent(Object source, Long userId, String username) {
        super(source);
        this.userId = userId;
        this.username = username;
        this.eventTime = LocalDateTime.now();
    }

    public abstract String getEventType();
    public abstract String getEventDescription();
    @Override
    public String toString() {
        return String.format("[%s]EventType:%s, Username:%s(ID:%s), EventTime:%s,Details:%s"
                ,getSource()
                        .getClass()
                        .getName(),
                getEventType(),
                username,
                userId,
                eventTime
                ,getEventDescription());

    }
}
