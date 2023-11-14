package com.example.select_lunch.vo.response.lunch;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Viewport {
    private Location northeast;
    private Location southwest;
}
