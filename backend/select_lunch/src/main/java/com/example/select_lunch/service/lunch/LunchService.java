package com.example.select_lunch.service.lunch;

import java.util.ArrayList;

import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.fasterxml.jackson.databind.JsonNode;

public interface LunchService {
    JsonNode searchOfCurrentLocation(String keyward, double lat, double lng);
}
