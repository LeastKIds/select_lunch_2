package com.example.select_lunch.service.lunch.best;

import org.springframework.stereotype.Service;

import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsRepository;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;
import java.util.ArrayList;
import java.util.Collections;
import java.lang.Math;

@Service
@AllArgsConstructor
@Slf4j
public class BestServiceImpl implements BestService{
    private final RestaurantsRepository restaurantsRepository;

    @Override
    public ArrayList<RestaurantsEntity> searchBestRestaurants(String keyword) {
        
        Optional<ArrayList<RestaurantsEntity>> optionalArrayListRestaurantsEntity = restaurantsRepository.findByKeywordsContaining(keyword);
        if(!optionalArrayListRestaurantsEntity.isPresent() || optionalArrayListRestaurantsEntity.get().isEmpty()) {
            log.error("데이터 없음");
            return null;
        } 
        
        ArrayList<RestaurantsEntity> arrayListRestaurantsEntities = optionalArrayListRestaurantsEntity.get();
        Collections.sort(arrayListRestaurantsEntities, (array1, array2) -> {
            return array2.getResult().getGraphHopperResponse().getPaths().get(0).getTime().compareTo(array1.getResult().getGraphHopperResponse().getPaths().get(0).getTime());
        });
        

        log.info("평점 계산중");
        int size = arrayListRestaurantsEntities.size() - 1;
        long minTime = arrayListRestaurantsEntities.get(size).getResult().getGraphHopperResponse().getPaths().get(0).getTime();
        long average = 0;

        for(RestaurantsEntity restaurantsEntity : arrayListRestaurantsEntities) 
            average += restaurantsEntity.getResult().getGraphHopperResponse().getPaths().get(0).getTime();
        average /= size;


        long standardDeviation = 0;
        for(RestaurantsEntity restaurantsEntity : arrayListRestaurantsEntities) 
            standardDeviation += Math.pow(restaurantsEntity.getResult().getGraphHopperResponse().getPaths().get(0).getTime() - average, 2);
        standardDeviation /= size;
        double standardDeviationDouble = Math.sqrt(standardDeviation);

        ArrayList<RestaurantsEntity> validEntities = new ArrayList<>();
        for(RestaurantsEntity restaurantsEntity : arrayListRestaurantsEntities) {
            Double point = (restaurantsEntity.getResult().getGraphHopperResponse().getPaths().get(0).getTime() - minTime) / (standardDeviationDouble) * 2;
            if(point >=10.0 )
                point = 10.0;
            point = 4 - (point / 10 * 4);
            point += restaurantsEntity.getResult().getReviewEvaluationPoint();
            restaurantsEntity.setPoint(point);
            if(!Double.isNaN(point))
                validEntities.add(restaurantsEntity);
        }

        Collections.sort(validEntities, (array1, array2) -> {
            return array2.getPoint().compareTo(array1.getPoint());
        });

        log.info("최상위 평점 3개의 가게 반환");
        return new ArrayList<>(validEntities.subList(0, 3));
    }
    
}
