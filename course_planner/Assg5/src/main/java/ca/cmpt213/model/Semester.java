package ca.cmpt213.model;

import ca.cmpt213.restapi.ApiSemesterWrapper;

import java.util.List;

/**
 * This class stores the information of each semester how many seat has been taken for the department (dept)
 */

public class Semester {
    private Department dept;
    private int semesterCode;
    private int totalCoursesTaken;

    public Semester(){
    }

    public Semester(Department dept, int semesterCode){
        this.dept = dept;
        this.semesterCode = semesterCode;
        this.totalCoursesTaken = 0;
    }

    public int getSemesterCode(){
        return semesterCode;
    }

    private int calculateTotalCoursesTaken(){
        int sum = 0;
        List<Course> courses = dept.getCourses();
        for(Course course : courses){
             sum += calculateEachCourseSeatTaken(course);
        }
        return sum;
    }

    private int calculateEachCourseSeatTaken(Course course) {
        int sum = 0;
        List<CourseOffering> offerings = course.getOfferings();
        for(CourseOffering offering : offerings){
            if(offering.getSemesterCode() == semesterCode) {
                sum += calculateEachOfferingSeatTaken(offering);
            }
        }
        return sum;
    }

    private int calculateEachOfferingSeatTaken(CourseOffering offering) {
        int sum = 0;
        List<Section> sections = offering.getSections();
        for(Section section : sections){
            if(section.getType().equals("LEC")) {
                sum += section.getEnrollmentTotal();
            }
        }
        return sum;
    }

    public ApiSemesterWrapper loadDataToSemesterWrapper(){
        totalCoursesTaken = calculateTotalCoursesTaken();
        ApiSemesterWrapper wrapper = new ApiSemesterWrapper();
        wrapper.semesterCode = semesterCode;
        wrapper.totalCoursesTaken = totalCoursesTaken;
        return wrapper;
    }
}
