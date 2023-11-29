package com.example.select_lunch.vo.response.lunch;

import java.util.ArrayList;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchKeywordsResponse {
    private ArrayList<String> keywords;
}
