package com.example.select_lunch.service.lunch;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.select_lunch.e.lunch.ReviewEvaluationEnum;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity.RestaurantsResult;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity.RestaurantsResult.RestaurantsResultReview;
import com.example.select_lunch.jpa.lunch.restaurants.keywords.KeywordsEntity;
import com.example.select_lunch.jpa.lunch.restaurants.keywords.KeywordsRepository;
import com.example.select_lunch.service.mapRoute.MapRouteService;
import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsRepository;
import com.example.select_lunch.util.stanfordCoreNLP.StanfordCoreNLPConfig;
import com.example.select_lunch.vo.request.SearchPlaceRequest;
import com.example.select_lunch.vo.request.mapRoute.MinDistancesRequest;
import com.example.select_lunch.vo.response.lunch.SearchGeocodingResponse;
import com.example.select_lunch.vo.response.lunch.SearchKeywordsResponse;
import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.example.select_lunch.vo.response.lunch.SearchReviewsTranslationResponse;
import com.example.select_lunch.vo.response.mapRoute.GraphHopperResponse;

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
    private final KeywordsRepository keywordsRepository;
    private final MapRouteService mapRouteService;


    @Override
    public SearchResponse searchOfCurrentLocation(String keyword, double lat, double lng, String next_page_token) {

        Optional<KeywordsEntity>optionalFindByKeywords = keywordsRepository.findByKeywords(keyword);
        if(!optionalFindByKeywords.isPresent()) {
            log.info("새로운 키워드");
            keywordsRepository
                .save(
                    KeywordsEntity
                        .builder()
                        .keywords(keyword)
                        .counts(0)
                        .build()
                    );
            log.info("키워드 저장");
        } else {
            KeywordsEntity keywordsEntity = optionalFindByKeywords.get();
            int count = keywordsEntity.getCounts();
            keywordsEntity.setCounts(count+1);
            keywordsRepository.save(keywordsEntity);
            log.info("키워드 카운트 증가 + 1");
        }


        String baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
        if(next_page_token == null) {
           
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                        .queryParam("keyword", keyword)
                        .queryParam("location", String.valueOf(lat) + "," + String.valueOf(lng))
                        .queryParam("radius", 500) // 단위는 미터
                        // .queryParam("rankby", "prominence")
                        .queryParam("type", "restaurant")
                        .queryParam("language", "ko") // 검색 결과를 한국어로 받기 위해 추가
                        .queryParam("key", env.getProperty("google.places.api_key"))
                        
                        .encode()
                        .toUriString();
            return restTemplate.getForObject(url,SearchResponse.class);
        } else {
            String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                        .queryParam("pagetoken", next_page_token)
                        .queryParam("key", env.getProperty("google.places.api_key"))
                        
                        .encode()
                        .toUriString();

            return restTemplate.getForObject(url, SearchResponse.class);
        }
        
    }

    @Override
    public SearchReviewResponse searchReviewsOfPlaceId(SearchPlaceRequest searchPlaceRequest) {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        Optional<RestaurantsEntity> searchDatabaseRestaurantsEntity = restaurantsRepository.findByResultPlaceId(searchPlaceRequest.getPlace_id());
        if(searchDatabaseRestaurantsEntity.isPresent()) {
            log.info("중복 값 존재");
            RestaurantsEntity restaurantsEntity = searchDatabaseRestaurantsEntity.get();

            ArrayList<String> prevKeywords = restaurantsEntity.getKeywords();
            Boolean isKeywordChange = prevKeywords.contains(searchPlaceRequest.getKeyword());
            if(!isKeywordChange) {
                log.info("새로운 키워드 발견");
                prevKeywords.add(searchPlaceRequest.getKeyword());
            }

            if(ChronoUnit.DAYS.between(LocalDate.now(), restaurantsEntity.getUpdateTime()) >= 1) {
                log.info("하루 지난 옛날 데이터");
                restaurantsRepository.delete(restaurantsEntity);
                return mapper.map(searchGooglePlaceIdApi(searchPlaceRequest, prevKeywords), SearchReviewResponse.class);
            } else {
                log.info("하루가 지나지 않은 신선한 데이터");
                if(!isKeywordChange) {
                    restaurantsEntity.setKeywords(prevKeywords);
                    restaurantsRepository.save(restaurantsEntity);
                }
                return mapper.map(restaurantsEntity, SearchReviewResponse.class);
            }

        } else {
            log.info("새로운 데이터");
            SearchReviewResponse searchReviewResponse = mapper.map(searchGooglePlaceIdApi(searchPlaceRequest, null), SearchReviewResponse.class);
            searchReviewResponse.getResult().setPlace_id(searchPlaceRequest.getPlace_id());
            return searchReviewResponse;
        }


        
    }


    private RestaurantsEntity searchGooglePlaceIdApi(SearchPlaceRequest searchPlaceRequest, ArrayList<String> prevKeywords) {

        String baseUrl = "https://maps.googleapis.com/maps/api/place/details/json";
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("place_id", searchPlaceRequest.getPlace_id())
                    .queryParam("language", "en") // 결과를 한국어로 받기 위해 추가
                    .queryParam("key", env.getProperty("google.places.api_key"))
                    .encode()
                    .toUriString();

        RestaurantsEntity restaurantsEntity = restTemplate.getForObject(url, RestaurantsEntity.class);
        

        RestaurantsResult restaurantsResult = restaurantsEntity.getResult();
        restaurantsResult.setPlaceId(searchPlaceRequest.getPlace_id());
        restaurantsEntity.setUpdateTime(LocalDate.now());
        ArrayList<String> keywords = restaurantsEntity.getKeywords();
        if(prevKeywords == null) {
            keywords = new ArrayList<String>();
            keywords.add(searchPlaceRequest.getKeyword());
        }       
        else
            keywords = prevKeywords;
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

        log.info("경로 찾는 중");
        GraphHopperResponse graphHopperResponse = mapRouteService.minDistances(
                MinDistancesRequest
                    .builder()
                    .startLat(searchPlaceRequest.getStartLat())
                    .startLng(searchPlaceRequest.getStartLng())
                    .endLat(searchPlaceRequest.getEndLat())
                    .endLng(searchPlaceRequest.getEndLng())
                    .build());
        
        restaurantsResult.setGraphHopperResponse(graphHopperResponse);
        restaurantsEntity.setResult(restaurantsResult);
        log.info("경로 저장");

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
        String baseUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("fields", "formatted_address,name,rating,opening_hours,geometry")
                .queryParam("input", address)
                .queryParam("inputtype", "textquery")
                .queryParam("key", env.getProperty("google.places.api_key"))
                .encode()
                .toUriString();

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

    @Override
    public SearchKeywordsResponse searchKeywords() {

        Optional<ArrayList<KeywordsEntity>> optionalArrayListKeywordsEntity = keywordsRepository.findAllByOrderByCountsDesc();
        if(!optionalArrayListKeywordsEntity.isPresent())
            return null;


        ArrayList<String> keywordsArrayList = optionalArrayListKeywordsEntity
                                                .get()
                                                .stream()
                                                .map(
                                                    KeywordsEntity::getKeywords
                                                )
                                                .collect(
                                                    Collectors
                                                        .toCollection(ArrayList::new)
                                                );
        if(keywordsArrayList.size() >=3)
            return SearchKeywordsResponse
                    .builder()
                    .keywords(new ArrayList<>(keywordsArrayList.subList(0, 3)))
                    .build();
        else
            return SearchKeywordsResponse
                    .builder()
                    .keywords(keywordsArrayList)
                    .build();

    }
    
}
