package com.example.select_lunch.service.lunch.best;

import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;

import java.util.ArrayList;


public interface BestService {
    ArrayList<RestaurantsEntity> searchBestRestaurants(String keyword);
}
