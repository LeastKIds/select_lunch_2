package com.example.select_lunch.vo.response.lunch;

import java.util.ArrayList;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResultResponse {
     private String business_status;
    private Geometry geometry;
    private String icon;
    private String icon_background_color;
    private String icon_mask_base_uri;
    private String name;
    private OpeningHours opening_hours;
    private ArrayList<Photo> photos;
    private String place_id;
    private PlusCode plus_code;
    private Double rating;
    private String reference;
    private String scope;
    private ArrayList<String> types;
    private Integer user_ratings_total;
    private String vicinity;
}
