package com.example.select_lunch.service.lunch;

import java.util.ArrayList;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.example.select_lunch.vo.response.lunch.SearchResponse.Result;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;


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
                    .queryParam("radius", 1000) // 단위는 미터
                    // .queryParam("rankby", "prominence")
                    .queryParam("type", "restaurant")
                    .queryParam("language", "ko") // 검색 결과를 한국어로 받기 위해 추가
                    .queryParam("key", env.getProperty("google.places.api_key"))
                    
                    .encode()
                    .toUriString();

        SearchResponse response = restTemplate.getForObject(url,SearchResponse.class);
        ArrayList<Result> results = response.getResults();

        // for(int i = 0; i<results.size(); i++) {

        // }
        


        return response;
    }
    
}
