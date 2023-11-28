package com.example.select_lunch.service.mapRoute;

import java.util.Arrays;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.select_lunch.vo.request.mapRoute.GraphHopperRequest;
import com.example.select_lunch.vo.request.mapRoute.MinDistancesRequest;
import com.example.select_lunch.vo.response.mapRoute.GraphHopperResponse;


import java.util.ArrayList;

import lombok.AllArgsConstructor;


@Service
@AllArgsConstructor
public class MapRouteServiceImpl implements MapRouteService{

    private final Environment env;
    private final RestTemplate restTemplate;
    

    @Override
    public GraphHopperResponse minDistances(MinDistancesRequest minDistances) {
        String baseUrl = "https://graphhopper.com/api/1/route";

        String url = UriComponentsBuilder.fromHttpUrl(baseUrl)
                        .queryParam("key", env.getProperty("graphhopper.api_key"))
                        .encode()
                        .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<GraphHopperRequest> request = new HttpEntity<>(
                                                    GraphHopperRequest
                                                        .builder()
                                                        .points(new ArrayList<>(
                                                            Arrays.asList(
                                                                new ArrayList<>(Arrays.asList(minDistances.getStartLng(), minDistances.getStartLat())),
                                                                new ArrayList<>(Arrays.asList(minDistances.getEndLng(), minDistances.getEndLat()))
                                                            )
                                                        ))
                                                        .point_hints(new ArrayList<>())
                                                        .snap_preventions(new ArrayList<>())
                                                        .details(new ArrayList<>())
                                                        .vehicle("foot")
                                                        .locale("en")
                                                        .instructions(true)
                                                        .calc_points(true)
                                                        .points_encoded(false)
                                                        .build()
                                                    , headers);


        return restTemplate.postForObject(url, request, GraphHopperResponse.class);

    }
    
}
