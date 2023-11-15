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

import com.example.select_lunch.service.lunch.LunchService;
import com.example.select_lunch.vo.request.SearchOfCurrentLocationRequest;
import com.example.select_lunch.vo.response.lunch.SearchResponse;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@AllArgsConstructor
@RequestMapping("/")
@Slf4j
public class LunchController {

    private final Environment env;
    private final RestTemplate restTemplate;
    private final LunchService lunchService;


    
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


    @GetMapping("/search/{keyward}")
    public String search(@PathVariable String keyward) {

        // String baseUrl = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
        // String uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
        //         .queryParam("input", search)
        //         .queryParam("inputtype", "textquery")
        //         .queryParam("fields", "formatted_address,name,rating,opening_hours,geometry")
        //         .queryParam("language", "ko")
        //         .queryParam("key", env.getProperty("google.places.api_key"))
        //         .encode()
        //         .toUriString();

        // return restTemplate.getForObject(uri, String.class);

        // 35.622995778484864, 139.56164735954468 기숙사


//         https://maps.googleapis.com/maps/api/place/photo
//   ?maxheight=400
//   &photoreference=[PHOTO_REFERENCE]
//   &key=YOUR_API_KEY

        String baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                    .queryParam("keyword", "food")
                    .queryParam("location", "35.622995778484864" + "," + "139.56164735954468")
                    .queryParam("radius", 1000) // 단위는 미터
                    // .queryParam("rankby", "prominence")
                    .queryParam("type", "restaurant")
                    .queryParam("language", "ko") // 검색 결과를 한국어로 받기 위해 추가
                    .queryParam("key", env.getProperty("google.places.api_key"))
                    

                    .encode()
                    .toUriString();

        return restTemplate.getForObject(url, String.class);

    }


    @PostMapping("/search/{keyward}")
    public ResponseEntity<SearchResponse> searchOfCurrentLocation(@PathVariable String keyward, @RequestBody SearchOfCurrentLocationRequest searchOfCurrentLocationRequest) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(lunchService
                .searchOfCurrentLocation(
                    keyward, 
                    searchOfCurrentLocationRequest.getLat(), 
                    searchOfCurrentLocationRequest.getLng()
                    )
                );
    }
    
}
