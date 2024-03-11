package ca.cmpt213;

import ca.cmpt213.model.ReadFile;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;

/**
 * This is a class that run the Spring Boot Application
 */
@SpringBootApplication
public class Application {
    public static void main(String[] args){
        try{
            ReadFile reader = new ReadFile("data/course_data_2018.csv");
            reader.extractDataFromFile();
        }
        catch(IOException e){
            e.printStackTrace();
        }
        SpringApplication.run(Application.class, args);
    }
}