package com.example.select_lunch.vo.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchPlaceRequest {
    private String place_id;
    private String keyword;
    private Double startLat;
    private Double startLng;
    private Double endLat;
    private Double endLng;
}
