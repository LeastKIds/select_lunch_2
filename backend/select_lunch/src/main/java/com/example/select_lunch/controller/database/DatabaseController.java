package com.example.select_lunch.controller.database;

import java.util.ArrayList;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;
import com.example.select_lunch.service.mongoDB.MongoDBService;

import lombok.AllArgsConstructor;


@RestController
@AllArgsConstructor
@RequestMapping("/db")
public class DatabaseController {
    
    private final MongoDBService mongoDBService;

    @GetMapping("/mongoDB/delete/{id}")
    public ResponseEntity<String> restaurantsDeleteEntity(@PathVariable String id) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(mongoDBService.restaurantsDeleteEntity(id));
    }


    @GetMapping("/mongoDB")
    public ResponseEntity<ArrayList<RestaurantsEntity>> restaurantsFindAll() {
        return ResponseEntity
                .status(
                    HttpStatus.OK
                )
                .body(
                    mongoDBService.restaurantsFindAll()
                );
    }

    
}
