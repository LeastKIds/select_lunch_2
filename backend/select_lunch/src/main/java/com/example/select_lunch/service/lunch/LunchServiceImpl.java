package com.example.select_lunch.service.lunch;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Optional;

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
import com.example.select_lunch.vo.response.lunch.SearchGeocodingResponse;
import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse.SearchReviewResult;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse.SearchReviewResult.Review;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
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
    public SearchReviewResponse searchReviewsOfPlaceId(String place_id, String keyword) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        Optional<RestaurantsEntity> searchDatabaseRestaurantsEntity = restaurantsRepository.findByResultPlaceId(place_id);
        if(searchDatabaseRestaurantsEntity.isPresent()) {
            log.info("중복 값 존재");
            RestaurantsEntity restaurantsEntity = searchDatabaseRestaurantsEntity.get();

            if(ChronoUnit.DAYS.between(LocalDate.now(), restaurantsEntity.getUpdateTime()) >= 1) {
                log.info("하루 지난 옛날 데이터");
                restaurantsRepository.delete(restaurantsEntity);
                return mapper.map(searchGooglePlaceIdApi(place_id, keyword), SearchReviewResponse.class);
            } else {
                log.info("하루가 지나지 않은 신선한 데이터");
                System.out.println(restaurantsEntity.toString());
                return mapper.map(restaurantsEntity, SearchReviewResponse.class);
            }

        } else {
            log.info("새로운 데이터");
            SearchReviewResponse searchReviewResponse = mapper.map(searchGooglePlaceIdApi(place_id, keyword), SearchReviewResponse.class);
            searchReviewResponse.getResult().setPlace_id(place_id);
            return searchReviewResponse;
        }


        
    }


    private RestaurantsEntity searchGooglePlaceIdApi(String place_id, String keyword) {
        String baseUrl = "https://maps.googleapis.com/maps/api/place/details/json";
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("place_id", place_id)
                    .queryParam("language", "en") // 결과를 한국어로 받기 위해 추가
                    .queryParam("key", env.getProperty("google.places.api_key"))
                    .encode()
                    .toUriString();

        RestaurantsEntity restaurantsEntity = restTemplate.getForObject(url, RestaurantsEntity.class);
        RestaurantsResult restaurantsResult = restaurantsEntity.getResult();
        restaurantsResult.setPlaceId(place_id);
        restaurantsEntity.setUpdateTime(LocalDate.now());
        ArrayList<String> keywords = restaurantsEntity.getKeywords();
        if(keywords == null)
            keywords = new ArrayList<String>();
        keywords.add(keyword);
        restaurantsEntity.setKeywords(keywords);
        ArrayList<RestaurantsResultReview> restaurantsResultReviews = restaurantsResult.getReviews();
    
        int reviewsCount = restaurantsResultReviews.size();
        if(reviewsCount != 0) {
            double reviewsSum = 0;
            for(int i = 0; i < reviewsCount; i++) {
                double point = StanfordCoreNLPConfig.analyzeOverallSentiment(restaurantsResultReviews.get(i).getText());
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
        }

        restaurantsEntity.setResult(restaurantsResult);
        restaurantsRepository.save(restaurantsEntity);
        log.info("데이터 저장");
        return restaurantsEntity;
    }


    @Override
    public SearchReviewsTranslationResponse searchReviewsTranslationResponse(String text) {
        
        return SearchReviewsTranslationResponse
                    .builder()
                    .translationText(Translator.translate(Language.ENGLISH, Language.JAPANESE, text))
                    .build();
    }

    @Override
    public SearchGeocodingResponse searchGeocoding(String address) {
        System.out.println("Geocoding");
        System.out.println("address: " + address);
        // String baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";

        // String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
        //         .queryParam("address", address)
        //         .queryParam("key", env.getProperty("google.places.api_key"))
        //         // .queryParam("language", "ko") // 결과를 한국어로 받기 위해 추가


        //         .encode()
        //         .toUriString();

        String baseUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("fields", "formatted_address,name,rating,opening_hours,geometry")
                .queryParam("input", address)
                .queryParam("inputtype", "textquery")
                .queryParam("key", env.getProperty("google.places.api_key"))
                .encode()
                .toUriString();

        // JsonElement responseElement = JsonParser.parseString(restTemplate.getForObject(url, String.class));
        // JsonObject responseObject = responseElement.getAsJsonObject();
        // JsonArray candidates = responseObject.get("candidates").getAsJsonArray();
        // JsonObject location = candidates.get(0).getAsJsonObject().get("geometry").getAsJsonObject().get("location").getAsJsonObject();
        // String response = restTemplate.getForObject(url, String.class);

        try {
            JsonObject location = JsonParser
                                .parseString(
                                    restTemplate.getForObject(url, String.class)
                                )
                                .getAsJsonObject()
                                .get("candidates")
                                .getAsJsonArray()
                                .get(0)
                                .getAsJsonObject()
                                .get("geometry")
                                .getAsJsonObject()
                                .get("location")
                                .getAsJsonObject();

            
        System.out.println("check");

            return SearchGeocodingResponse
                .builder()
                .lat(location.get("lat").getAsDouble())
                .lng(location.get("lng").getAsDouble())
                .build();
        } catch (Exception e) {
            log.error("값이 없어용!");

            return SearchGeocodingResponse
                    .builder()
                    .lat(0.0)
                    .lng(0.0)
                    .build();
        }
        

        
    }
    
}
