package com.example.select_lunch.util.stanfordCoreNLP;

import java.util.List;
import java.util.Properties;
import java.util.stream.Collectors;

import edu.stanford.nlp.ling.CoreAnnotations;
import edu.stanford.nlp.neural.rnn.RNNCoreAnnotations;
import edu.stanford.nlp.pipeline.StanfordCoreNLP;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations;
import edu.stanford.nlp.sentiment.SentimentCoreAnnotations.SentimentAnnotatedTree;
import edu.stanford.nlp.util.CoreMap;

public class StanfordCoreNLPConfig  {

     record SentimentRecord(String name, int value, String sentence) {
    }

    public static SentimentRecord convertToSentimentRecord(CoreMap sentence) {
        var tree = sentence.get(SentimentAnnotatedTree.class);
        return new SentimentRecord(
                sentence.get(SentimentCoreAnnotations.SentimentClass.class),
                RNNCoreAnnotations.getPredictedClass(tree),
                sentence.toString());
    }

    public static boolean negativeComments(SentimentRecord sentimentRecord) {
        return sentimentRecord.value < 2;
    }

    public static boolean positiveComments(SentimentRecord sentimentRecord) {
        return sentimentRecord.value > 2;
    }

    public static List<SentimentRecord> analyzeAndReturn(String content) {
        var props = new Properties();
        // tokenizer, sentence splitting, consistuency parsing, sentiment analysis
        props.setProperty("annotators", "tokenize, ssplit, parse, sentiment");
        var pipeline = new StanfordCoreNLP(props);
        var annotation = pipeline.process(content);
        return annotation.get(CoreAnnotations.SentencesAnnotation.class).stream()
                .map(StanfordCoreNLPConfig::convertToSentimentRecord)
                .collect(Collectors.toList());
    }

    public static double analyzeOverallSentiment(String content) {
        List<SentimentRecord> sentimentRecords = analyzeAndReturn(content);
    
        return sentimentRecords.stream()
                .mapToInt(SentimentRecord::value)
                .average()
                .orElse(Double.NaN);
    }
       
}
