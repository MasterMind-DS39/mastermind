package com.ds39.mastermind.service;

import dev.langchain4j.service.spring.AiService;
import dev.langchain4j.service.V;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.SystemMessage;


@AiService
public interface QuizAiAgent {

    @SystemMessage("""
        You are an AI quiz generator. Given a list of lesson titles, generate a quiz of 10 multiple-choice questions. 
        Each question should include 4 options labeled A, B, C, and D, and indicate the correct answer using the corresponding letter.
        Always respond in pure JSON with the following structure:
        {
          "questions": [
            {
              "question": "string",
              "options": {
                "A": "string",
                "B": "string",
                "C": "string",
                "D": "string"
              },
              "correctAnswer": "A" // or B, C, D
            },
            ...
          ]
        }
    """)
    @UserMessage("Generate a 10-question quiz from the following completed lessons: {{lessons}}. Return ONLY in the specified JSON format.")
    String generateQuizFromLessons(@V("lessons") String lessons);
}