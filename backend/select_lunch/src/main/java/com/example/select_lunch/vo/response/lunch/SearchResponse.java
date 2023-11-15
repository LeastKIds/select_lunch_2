package com.example.select_lunch.vo.response.lunch;

import java.util.ArrayList;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchResponse {
   private ArrayList html_attributions;
   private String next_page_token;
   private ArrayList<ResultResponse> results;
   private Integer status;
}

