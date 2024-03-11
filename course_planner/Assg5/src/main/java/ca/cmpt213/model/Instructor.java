package ca.cmpt213.model;

/**
 * Immutable class
 * This class stores the instructor name
 */
public class Instructor {
    private final String name;
    public Instructor(String name){
        this.name = name;
    }

    public String getName(){
        return name;
    }
}
