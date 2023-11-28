package com.example.select_lunch.controller.mapRoute;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.select_lunch.service.mapRoute.MapRouteService;
import com.example.select_lunch.vo.request.mapRoute.MinDistancesRequest;
import com.example.select_lunch.vo.response.mapRoute.GraphHopperResponse;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
@RequestMapping("/mapRoute")
public class MapRouteController {
    private final MapRouteService mapRouteService;

    @PostMapping("/minDistances")
    public ResponseEntity<GraphHopperResponse> minDistances(@RequestBody MinDistancesRequest minDistancesRequest) {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(mapRouteService.minDistances(minDistancesRequest));
    }
}
