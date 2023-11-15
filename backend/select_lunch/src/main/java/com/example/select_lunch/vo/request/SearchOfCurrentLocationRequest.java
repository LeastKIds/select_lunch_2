package com.example.select_lunch.vo.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SearchOfCurrentLocationRequest {
    private Double lat;
    private Double lng;
}
