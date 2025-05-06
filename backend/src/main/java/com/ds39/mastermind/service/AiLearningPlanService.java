package com.ds39.mastermind.service;

import dev.langchain4j.service.spring.AiService;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.V;


@AiService
public interface AiLearningPlanService {
    @SystemMessage("You are an expert learning path designer. You always respond with structured JSON. Each plan has a title, description, and a list of lessons. Each lesson has a title and a list of learning resources as URLs.")
    @UserMessage("Generate a complete learning plan for the topic: {{topic}}. Respond ONLY in JSON format with fields: title, description, lessons (title, resources [url]).")
    String generateLearningPlan(@V("topic") String topic);
}