package ca.cmpt213.model;

import ca.cmpt213.restapi.ApiOfferingSectionWrapper;

/**
 * This class stores the information of each section
 * Each section has its own type (LEC, LAB, ...), the total number of people that has enrollment into this section (enrollmentTotal)
 * , and the total number of spaces that allowed people to enroll (enrollmentCapacity)
 */

public class Section {
    private final String type;
    private int enrollmentTotal;
    private int enrollmentCapacity;

    public Section(String type, int enrolCap, int enrollmentTotal){
        this.type = type;
        this.enrollmentCapacity = enrolCap;
        this.enrollmentTotal = enrollmentTotal;
    }

    public String getType(){
        return type;
    }

    public int getEnrollmentTotal() {
        return enrollmentTotal;
    }

    public int getEnrollmentCapacity() {
        return enrollmentCapacity;
    }

    public void addEnrollmentCapacity (int enrolCap){
        enrollmentCapacity += enrolCap;
    }

    public void addEnrollmentTotal (int enrolTotal){
        enrollmentTotal += enrolTotal;
    }

    public ApiOfferingSectionWrapper loadDataToSectionWrapper() {
        ApiOfferingSectionWrapper wrapper = new ApiOfferingSectionWrapper();
        wrapper.type = getType();
        wrapper.enrollmentTotal = getEnrollmentTotal();
        wrapper.enrollmentCap = getEnrollmentCapacity();
        return wrapper;
    }
}
