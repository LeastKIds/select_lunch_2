package com.example.select_lunch.service.lunch;

import java.util.ArrayList;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.select_lunch.e.lunch.ReviewEvaluationEnum;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity.RestaurantsResult;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity.RestaurantsResult.RestaurantsResultReview;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsRepository;
import com.example.select_lunch.util.stanfordCoreNLP.StanfordCoreNLPConfig;
import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse.SearchReviewResult;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse.SearchReviewResult.Review;
import com.example.select_lunch.vo.response.lunch.SearchReviewsTranslationResponse;


import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.suuft.libretranslate.Language;
import net.suuft.libretranslate.Translator;


@Service
@AllArgsConstructor
@Slf4j
public class LunchServiceImpl implements LunchService{

    private final Environment env;
    private final RestTemplate restTemplate;
    private final RestaurantsRepository restaurantsRepository;


    @Override
    public SearchResponse searchOfCurrentLocation(String keyward, double lat, double lng) {

        String baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("keyword", keyward)
                    .queryParam("location", String.valueOf(lat) + "," + String.valueOf(lng))
                    .queryParam("radius", 500) // 단위는 미터
                    // .queryParam("rankby", "prominence")
                    .queryParam("type", "restaurant")
                    .queryParam("language", "ko") // 검색 결과를 한국어로 받기 위해 추가
                    .queryParam("key", env.getProperty("google.places.api_key"))
                    
                    .encode()
                    .toUriString();

        return restTemplate.getForObject(url,SearchResponse.class);
    }

    @Override
    public SearchReviewResponse searchReviewsOfPlaceId(String place_id) {
        String baseUrl = "https://maps.googleapis.com/maps/api/place/details/json";
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("place_id", place_id)
                    .queryParam("language", "en") // 결과를 한국어로 받기 위해 추가
                    .queryParam("key", env.getProperty("google.places.api_key"))
                    .encode()
                    .toUriString();

        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        RestaurantsEntity restaurantsEntity = restTemplate.getForObject(url, RestaurantsEntity.class);
        RestaurantsResult restaurantsResult = restaurantsEntity.getResult();
        restaurantsResult.setPlaceId(place_id);
        ArrayList<RestaurantsResultReview> restaurantsResultReviews = restaurantsResult.getReviews();
       
        SearchReviewResponse searchReviewResponse = mapper.map(restaurantsEntity, SearchReviewResponse.class);
        SearchReviewResult searchReviewResult = searchReviewResponse.getResult();
        searchReviewResult.setPlace_id(place_id);
        ArrayList<Review> reviews = searchReviewResult.getReviews();

        int reviewsCount = reviews.size();
        if(reviewsCount != 0) {
            double reviewsSum = 0;
            for(int i = 0; i < reviewsCount; i++) {
                double point = StanfordCoreNLPConfig.analyzeOverallSentiment(reviews.get(i).getText());
                reviewsSum += point;
                restaurantsResultReviews.get(i).setEvaluationPoint(point);
                if(point > 2.5)
                    restaurantsResultReviews.get(i).setEvaluation(ReviewEvaluationEnum.POSITIVE);
                else if (point < 2)
                    restaurantsResultReviews.get(i).setEvaluation(ReviewEvaluationEnum.NEGATIVE);
                else 
                    restaurantsResultReviews.get(i).setEvaluation(ReviewEvaluationEnum.NEUTRAL);
            }
            double reviewsResult = reviewsSum / reviewsCount;
            restaurantsResult.setReviewEvaluationPoint(reviewsResult);

            ReviewEvaluationEnum reviewEvaluationEnum;
            if(reviewsResult > 2.5) 
                reviewEvaluationEnum = ReviewEvaluationEnum.POSITIVE;
            else if(reviewsResult < 2) 
                reviewEvaluationEnum = ReviewEvaluationEnum.NEGATIVE;
            else
                reviewEvaluationEnum = ReviewEvaluationEnum.NEUTRAL;
            
            restaurantsResult.setReviewEvaluation(reviewEvaluationEnum);
            searchReviewResult.setReviewEvaluation(reviewEvaluationEnum);
        }


        restaurantsEntity.setResult(restaurantsResult);
        restaurantsRepository.save(restaurantsEntity);

        return mapper.map(restaurantsEntity, SearchReviewResponse.class);
    }


    @Override
    public SearchReviewsTranslationResponse searchReviewsTranslationResponse(String text) {
        
        return SearchReviewsTranslationResponse
                    .builder()
                    .translationText(Translator.translate(Language.ENGLISH, Language.JAPANESE, text))
                    .build();
    }
    
}
