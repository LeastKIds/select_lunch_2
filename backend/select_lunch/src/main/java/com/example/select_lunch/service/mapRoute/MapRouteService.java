package com.example.select_lunch.service.mapRoute;

import com.example.select_lunch.vo.request.mapRoute.MinDistancesRequest;
import com.example.select_lunch.vo.response.mapRoute.GraphHopperResponse;

public interface MapRouteService {
    GraphHopperResponse minDistances(MinDistancesRequest minDistances);
} 