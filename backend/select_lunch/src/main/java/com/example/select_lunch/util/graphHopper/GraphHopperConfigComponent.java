// package com.example.select_lunch.util.graphHopper;

// import java.util.Collections;
// import java.util.Locale;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.core.env.Environment;

// import com.example.select_lunch.vo.request.mapRoute.MinDistancesRequest;
// import com.graphhopper.GHRequest;
// import com.graphhopper.GHResponse;
// import com.graphhopper.GraphHopper;
// import com.graphhopper.GraphHopperConfig;
// import com.graphhopper.ResponsePath;
// import com.graphhopper.config.CHProfile;
// import com.graphhopper.config.Profile;
// import com.graphhopper.util.Helper;
// import com.graphhopper.util.Instruction;
// import com.graphhopper.util.InstructionList;
// import com.graphhopper.util.Translation;

// import lombok.AllArgsConstructor;

// // @Configuration
// // @AllArgsConstructor
// public class GraphHopperConfigComponent {
    
//     // private final Environment env;

//     @Bean
//     public GraphHopper graphHopper(Environment env) {
//         String filePath = env.getProperty("graphhopper.osm-file-path");
//         String locationPath = env.getProperty("graphhopper.graph-hopper-location");
//         GraphHopper hopper = createGraphHopperInstance(filePath, locationPath);
//         return hopper;
//     }


//     static GraphHopper createGraphHopperInstance(String fileAddress, String locationPath) {
//         System.out.println("create start");
//         GraphHopper hopper = new GraphHopper();
//         System.out.println("generate hopper");
//         hopper.setOSMFile(fileAddress);
//         // api server로 사용할것이기 때문에 그래프는 저장할 필요 없음
//         hopper.setGraphHopperLocation(locationPath);
//         System.out.println("location start");
//         hopper.setProfiles(new Profile("foot").setVehicle("foot").setTurnCosts(false));
//         System.out.println("set profiles start");
//         hopper.getCHPreparationHandler().setCHProfiles(new CHProfile("foot"));
//         System.out.println("getCHP start");
//         hopper.importOrLoad();
//         System.out.println("importorload start");
//         return hopper;
//     }

//     public static void routing(GraphHopper hopper, double startLat, double startLng, double endLat, double endLng) {
//         System.out.println("routing start");
//         GHRequest req = new GHRequest(startLat, startLng, endLat, endLat);
//         System.out.println("req start");
//         GHResponse rsp = hopper.route(req);
//         System.out.println("rsp start");
//         if(rsp.hasErrors()){
//             System.out.println("에러 발생");
//             throw new RuntimeException(rsp.getErrors().toString());
//         }
            
        
//         ResponsePath path = rsp.getBest();
//         double distance = path.getDistance();
//         long timeInMs = path.getTime();

//         System.out.println(path);
//         System.out.println(distance);
//         System.out.println(timeInMs);

//         Translation tr = hopper.getTranslationMap().getWithFallBack(Locale.UK);
//         InstructionList il = path.getInstructions();
//         // iterate over all turn instructions
//         for (Instruction instruction : il) {
//             System.out.println("distance " + instruction.getDistance() + " for instruction: " + instruction.getTurnDescription(tr));
//         }

//         assert il.size() == 6;
//         assert Helper.round(path.getDistance(), -2) == 900;
//     }
// }
