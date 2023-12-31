package com.example.select_lunch.vo.response.lunch;

import java.util.ArrayList;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchResponse {
   private ArrayList html_attributions;
   private String next_page_token;
   private ArrayList<Result> results;
   private String status;
   

   @Data
   @Builder
   public static class Result {
      private String name;
      private String place_id;
      private Integer price_level;
      private Double rating;
      private ArrayList<String> types;
      private String vicinity;
      private Integer user_ratings_total;
      private ArrayList<Photo> photos; 
      private Object opening_hours;
      private Geometry geometry;

      @Data
      @Builder
      public static class Photo {
         private ArrayList<String> html_attributions;
         private String photo_reference;
      }

      @Data
      @Builder
      public static class Geometry {
         private Location location;
         private Viewport Viewport;
         

         @Data
         @Builder
         public static class Location {
            private Double lat;
            private Double lng;
         }

         @Data
         @Builder
         public static class Viewport {
            private Location northeast;
            private Location southwest;
         }


      }

      // @Data
      // @Builder
      // public static class OpeningHours {
      //    private Boolean open_now;
      // }
   }

   
}

