package com.example.select_lunch.vo.response.mapRoute;

import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GraphHopperResponse {
    private ArrayList<Path> paths;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Path {
        private Double distance;
        private Double weight;
        private Long time;
        private Point points;

        @Data
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor
        public static class Point {
            private ArrayList<ArrayList<Double>> coordinates;
        }
    }
}
