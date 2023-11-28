package com.example.select_lunch.vo.request.mapRoute;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GraphHopperRequest {
    private ArrayList<ArrayList<Double>> points;
    private ArrayList<String> point_hints;

    private ArrayList<String> snap_preventions;
    private ArrayList<String> details;
    private String vehicle;
    private String locale;
    private Boolean instructions;
    private Boolean calc_points;
    private Boolean points_encoded;
}
