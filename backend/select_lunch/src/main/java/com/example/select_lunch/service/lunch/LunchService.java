package com.example.select_lunch.service.lunch;

import com.fasterxml.jackson.databind.JsonNode;

public interface LunchService {
    JsonNode searchOfCurrentLocation(String keyward, double lat, double lng);
}
