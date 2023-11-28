package com.example.select_lunch.vo.request.mapRoute;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MinDistancesRequest {
    private Double startLat;
    private Double startLng;

    private Double endLat;
    private Double endLng;
}
