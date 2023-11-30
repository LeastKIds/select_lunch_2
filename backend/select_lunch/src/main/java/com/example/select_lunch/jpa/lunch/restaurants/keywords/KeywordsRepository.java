package com.example.select_lunch.jpa.lunch.restaurants.keywords;

import java.util.ArrayList;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface KeywordsRepository extends MongoRepository<KeywordsEntity, String>{
    
    Optional<KeywordsEntity> findByKeywords(String keywords);
    Optional<ArrayList<KeywordsEntity>> findAllByOrderByCountsDesc();
}
