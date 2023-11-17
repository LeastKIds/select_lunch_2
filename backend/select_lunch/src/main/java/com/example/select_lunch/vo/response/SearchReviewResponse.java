package com.example.select_lunch.vo.response;

import java.util.ArrayList;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchReviewResponse {
    private ArrayList html_attributions;
    private SearchReviewResult result;
    private String status;


    @Data
    @Builder
    public static class SearchReviewResult {
        private CurrentOpeningHours current_opening_hours;
        private Boolean delivery;
        private String formatted_address;
        private String formatted_phone_number;
        private String name;
        private String place_id;
        private Integer price_level;
        private Integer rating;
        private ArrayList<Review> reviews;
        private Boolean takeout;
        private ArrayList<String> types;
        private String url;
        private Integer user_ratings_total;
        private String website;

        @Data
        @Builder
        public static class CurrentOpeningHours {
            private Boolean open_now;
            private ArrayList<String> weekday_text;
        }

        @Data
        @Builder
        public static class Photo {
            private ArrayList<String> html_attributions;
            private String photo_reference;
        }

        @Data
        @Builder
        public static class Review {
            private String author_name;
            private String author_url;
            private String language;
            private String original_language;
            private String profile_photo_url;
            private Integer rating;
            private String relative_time_description;
            private String text;
        }

    }

}
