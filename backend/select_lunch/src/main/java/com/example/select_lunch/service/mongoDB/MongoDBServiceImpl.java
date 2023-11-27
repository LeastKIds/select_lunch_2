package com.example.select_lunch.service.mongoDB;

import java.util.ArrayList;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsRepository;
import com.example.select_lunch.jpa.lunch.restaurants.keywords.KeywordsEntity;
import com.example.select_lunch.jpa.lunch.restaurants.keywords.KeywordsRepository;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@AllArgsConstructor
@Slf4j
public class MongoDBServiceImpl implements MongoDBService {

    private final RestaurantsRepository restaurantsRepository;
    private final KeywordsRepository keywordsRepository;

    @Override
    public ArrayList<RestaurantsEntity> restaurantsFindAll() {
        return new ArrayList<>(restaurantsRepository.findAll());
    }

    @Override
    public String restaurantsDeleteEntity(String id) {
        Optional<RestaurantsEntity> optionalDeleteEntity = restaurantsRepository.findById(id);
        if(optionalDeleteEntity.isPresent()) {
            RestaurantsEntity deleteEntity = optionalDeleteEntity.get();
            restaurantsRepository.delete(deleteEntity);
            return "삭제 완료";
        } else {
            return "해당 ID의 값을 가지고 있는 ENTITY는 존재하지 않습니다.";
        }

    }

    @Override
    public ArrayList<KeywordsEntity> keywordsFindAll() {
       return new ArrayList<>(keywordsRepository.findAll());
    }
    
}
