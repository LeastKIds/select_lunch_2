package com.example.select_lunch.service.lunch;

import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewsTranslationResponse;

public interface LunchService {
    SearchResponse searchOfCurrentLocation(String keyward, double lat, double lng);

    SearchReviewResponse searchReviewsOfPlaceId(String place_id, String keyword);

    SearchReviewsTranslationResponse searchReviewsTranslationResponse(String text);
}
