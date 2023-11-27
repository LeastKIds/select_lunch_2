package com.example.select_lunch.service.mongoDB;

import java.util.ArrayList;
import java.util.Optional;

import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;
import com.example.select_lunch.jpa.lunch.restaurants.keywords.KeywordsEntity;

public interface MongoDBService {
    ArrayList<RestaurantsEntity> restaurantsFindAll();

    String restaurantsDeleteEntity(String id);

    ArrayList<KeywordsEntity> keywordsFindAll();
}
