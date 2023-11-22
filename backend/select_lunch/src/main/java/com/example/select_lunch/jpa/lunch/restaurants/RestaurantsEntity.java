package com.example.select_lunch.jpa.lunch.restaurants;

import java.time.LocalDate;
import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.example.select_lunch.e.lunch.ReviewEvaluationEnum;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document
public class RestaurantsEntity {
    @Id
    private String id;

    private ArrayList<String> html_attributions;
    private RestaurantsResult result;
    private String status;
    private LocalDate updateTime;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RestaurantsResult {
        private RestaurantsResultCurrentOpeningHours current_opening_hours;
        private Boolean delivery;
        private String formatted_address;
        private String formatted_phone_number;
        private String name;
        private String placeId;
        private Integer price_level;
        private Integer rating;
        private ArrayList<RestaurantsResultReview> reviews;
        private ReviewEvaluationEnum reviewEvaluation;
        private Double reviewEvaluationPoint;
        private Boolean takeout;
        private ArrayList<String> types;
        private String url;
        private Integer user_ratings_total;
        private String website;

        @Data
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor
        public static class RestaurantsResultCurrentOpeningHours {
            private Boolean open_now;
            private ArrayList<String> weekday_text;
        }

        @Data
        @Builder
        @AllArgsConstructor
        @NoArgsConstructor
        public static class RestaurantsResultReview {
            private String author_name;
            private String author_url;
            private String language;
            private String original_language;
            private String profile_photo_url;
            private Integer rating;
            private String relative_time_description;
            private String text;
            private ReviewEvaluationEnum evaluation;
            private Double evaluationPoint;
        }
    }
}
