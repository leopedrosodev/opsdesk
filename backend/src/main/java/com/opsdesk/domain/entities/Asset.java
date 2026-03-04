package com.opsdesk.domain.entities;

import java.util.Set;

public class Asset {
    private Long id;
    private String name;
    private String type;
    private Long ownerId;
    private String ip;
    private String location;
    private Set<String> tags;

    public Asset(Long id, String name, String type, Long ownerId, String ip, String location, Set<String> tags) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.ownerId = ownerId;
        this.ip = ip;
        this.location = location;
        this.tags = tags;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public String getIp() {
        return ip;
    }

    public String getLocation() {
        return location;
    }

    public Set<String> getTags() {
        return tags;
    }

    public void update(String name, String type, Long ownerId, String ip, String location, Set<String> tags) {
        this.name = name;
        this.type = type;
        this.ownerId = ownerId;
        this.ip = ip;
        this.location = location;
        this.tags = tags;
    }
}
