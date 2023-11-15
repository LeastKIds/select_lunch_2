package com.example.select_lunch.service.lunch;

import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.fasterxml.jackson.databind.JsonNode;

public interface LunchService {
    SearchResponse searchOfCurrentLocation(String keyward, double lat, double lng);
}
