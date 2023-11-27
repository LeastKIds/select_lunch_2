package com.example.select_lunch.jpa.lunch.restaurants.keywords;

import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface KeywordsRepository extends MongoRepository<KeywordsEntity, String>{
    
    Optional<String> findByKeywords(String keywords);
}
