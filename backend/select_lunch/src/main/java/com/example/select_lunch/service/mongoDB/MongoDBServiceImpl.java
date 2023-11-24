package com.example.select_lunch.service.mongoDB;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@AllArgsConstructor
@Slf4j
public class MongoDBServiceImpl implements MongoDBService {

    private final RestaurantsRepository restaurantsRepository;

    @Override
    public ArrayList<RestaurantsEntity> restaurantsFindAll() {
        return new ArrayList<>(restaurantsRepository.findAll());
    }
    
}
