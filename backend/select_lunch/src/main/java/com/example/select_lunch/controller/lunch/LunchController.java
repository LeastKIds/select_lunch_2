package com.example.select_lunch.controller.lunch;

import java.util.ArrayList;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.select_lunch.jpa.lunch.restaurants.RestaurantsEntity;
import com.example.select_lunch.service.lunch.LunchService;
import com.example.select_lunch.service.lunch.best.BestService;
import com.example.select_lunch.vo.request.SearchOfCurrentLocationRequest;
import com.example.select_lunch.vo.request.SearchPlaceRequest;
import com.example.select_lunch.vo.request.SearchReviewsTranslationRequest;
import com.example.select_lunch.vo.response.lunch.SearchGeocodingResponse;
import com.example.select_lunch.vo.response.lunch.SearchKeywordsResponse;
import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewResponse;
import com.example.select_lunch.vo.response.lunch.SearchReviewsTranslationResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;


@RestController
@AllArgsConstructor
@RequestMapping("/")
public class LunchController {

    private final LunchService lunchService;
    private final BestService bestService;

    @PostMapping("/search/reviews/translation")
    public ResponseEntity<SearchReviewsTranslationResponse> searchReviewsTranslation(@RequestBody SearchReviewsTranslationRequest searchReviewsTranslationRequest) {
        return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(
                        lunchService
                            .searchReviewsTranslationResponse(
                                searchReviewsTranslationRequest.getText()
                            )
                    );
    }



    @PostMapping("/search/place")
    public ResponseEntity<SearchReviewResponse> searchReviewsOfPlaceId(@RequestBody SearchPlaceRequest searchPlaceRequest) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    lunchService.searchReviewsOfPlaceId(searchPlaceRequest)
                );
    }

    @GetMapping("/search/geocoding/{address}")
    public ResponseEntity<SearchGeocodingResponse> searchGeocoding(@PathVariable String address) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    lunchService.searchGeocoding(address)
                );
    }


    @GetMapping("/search/keywords")
    public ResponseEntity<SearchKeywordsResponse> searchKeywords() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(lunchService.searchKeywords());
    }

    @GetMapping("/search/best/{keyword}")
    public ResponseEntity<ArrayList<RestaurantsEntity>> searchBestRestaurants(@PathVariable String keyword) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(bestService.searchBestRestaurants(keyword));
    }



    @PostMapping("/search/{keyward}")
    public ResponseEntity<SearchResponse> searchOfCurrentLocation(@PathVariable String keyward, @RequestBody SearchOfCurrentLocationRequest searchOfCurrentLocationRequest) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(lunchService
                .searchOfCurrentLocation(
                    keyward, 
                    searchOfCurrentLocationRequest.getLat(), 
                    searchOfCurrentLocationRequest.getLng(),
                    searchOfCurrentLocationRequest.getNext_page_token()
                    )
                );
    }

    
    


    








    @GetMapping("/test")
    public String test() {
        return "test  OKasdfafd";
    }

    @GetMapping("/get-ip")
    public String getClientIp(HttpServletRequest request) {
        String remoteAddr = "";

        if (request != null) {
            remoteAddr = request.getHeader("X-FORWARDED-FOR");
            if (remoteAddr == null || "".equals(remoteAddr)) {
                remoteAddr = request.getRemoteAddr();
            }
        }

        return remoteAddr;
    }

    @GetMapping("/check-origin")
    public String checkOrigin(HttpServletRequest request) {
        // 클라이언트의 Origin 헤더 값 가져오기
        String originHeader = request.getHeader("Origin");
        System.out.println("Origin Received: " + originHeader);
        
        // 여기에 추가적인 로직을 구현할 수 있습니다. 예를 들어, 허용 목록과 비교 등
        // ...

        return "Origin Header received: " + originHeader;
    }
}
