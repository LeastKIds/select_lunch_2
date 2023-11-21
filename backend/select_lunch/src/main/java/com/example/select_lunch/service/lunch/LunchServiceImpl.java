package com.example.select_lunch.service.lunch;

import java.util.ArrayList;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.select_lunch.e.lunch.ReviewEvaluationEnum;
import com.example.select_lunch.util.stanfordCoreNLP.StanfordCoreNLPConfig;
import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse.SearchReviewResult;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse.SearchReviewResult.Review;
import com.example.select_lunch.vo.response.lunch.SearchReviewsTranslationResponse;
import com.example.select_lunch.vo.response.lunch.SearchResponse.Result;
import com.example.select_lunch.vo.response.lunch.SearchResponse.Result.Photo;

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

        SearchReviewResponse searchReviewResponse = restTemplate.getForObject(url, SearchReviewResponse.class);
        SearchReviewResult searchReviewResult = searchReviewResponse.getResult();
        ArrayList<Review> reviews = searchReviewResult.getReviews();

        int reviewsCount = reviews.size();
        if(reviewsCount != 0) {
            double reviewsSum = 0;
            for(int i = 0; i < reviewsCount; i++) {
                reviewsSum += StanfordCoreNLPConfig.analyzeOverallSentiment(reviews.get(i).getText());
            }
            double reviewsResult = reviewsSum / reviewsCount;
            if(reviewsResult > 2.5) 
                searchReviewResult.setReviewEvaluation(ReviewEvaluationEnum.POSITIVE);
            else if(reviewsResult < 2) 
                searchReviewResult.setReviewEvaluation(ReviewEvaluationEnum.NEGATIVE);
            else
                searchReviewResult.setReviewEvaluation(ReviewEvaluationEnum.NEUTRAL);
        }


        searchReviewResponse.setResult(searchReviewResult);
        return searchReviewResponse;
        

    }


    @Override
    public SearchReviewsTranslationResponse searchReviewsTranslationResponse(String text) {
        
        return SearchReviewsTranslationResponse
                    .builder()
                    .translationText(Translator.translate(Language.ENGLISH, Language.JAPANESE, text))
                    .build();
    }
    
}
