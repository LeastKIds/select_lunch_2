package com.example.select_lunch.service.lunch;

import com.example.select_lunch.vo.request.SearchPlaceRequest;
import com.example.select_lunch.vo.response.lunch.SearchGeocodingResponse;
import com.example.select_lunch.vo.response.lunch.SearchKeywordsResponse;
import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewsTranslationResponse;

public interface LunchService {
    SearchResponse searchOfCurrentLocation(String keyward, double lat, double lng, String next_page_token);

    SearchReviewResponse searchReviewsOfPlaceId(SearchPlaceRequest searchPlaceRequest);

    SearchReviewsTranslationResponse searchReviewsTranslationResponse(String text);

    SearchGeocodingResponse searchGeocoding(String address);

    SearchKeywordsResponse searchKeywords();
}
