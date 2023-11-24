package com.example.select_lunch.service.mongoDB;

import java.util.ArrayList;
import java.util.Optional;

import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;

public interface MongoDBService {
    ArrayList<RestaurantsEntity> restaurantsFindAll();
}
