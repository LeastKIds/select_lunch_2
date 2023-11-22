package com.example.select_lunch.jpa.lunch.restaurants;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RestaurantsRepository extends MongoRepository<RestaurantsEntity, String>{
    RestaurantsEntity findByStatus(String status);
    Optional<RestaurantsEntity> findByResultPlaceId(String placeId);
}
