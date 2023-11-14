package com.example.select_lunch.vo.response.lunch;

import java.util.ArrayList;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Photo {
    private Double height;
    private ArrayList<HtmlAttribution> html_attributions;
    private String photo_reference;
    private Double width;
}
