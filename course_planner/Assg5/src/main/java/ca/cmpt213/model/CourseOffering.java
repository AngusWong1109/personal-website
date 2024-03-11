package ca.cmpt213.model;

import ca.cmpt213.restapi.ApiCourseOfferingWrapper;
import ca.cmpt213.restapi.ApiOfferingSectionWrapper;

import java.util.ArrayList;
import java.util.List;

/**
 * This class stores the information of each course offerings.
 * Each course offering has 1 or many sections
 * Each course offering has its own unique courseOfferingId
 * It also stores the location, instructors, year, SFU semester code, and term for each course offering.
 */
public class CourseOffering {
    private int courseOfferingId;
    private String location;
    private List<Instructor> instructors = new ArrayList<>();
    private int year;
    private int semesterCode;
    private String term;
    private final List<Section> sections = new ArrayList<>();
    private static final String COMMA_WITH_SPACE = ", ";

    public CourseOffering(){
    }

    public CourseOffering (int id, String location, int semesterCode, List<Instructor> instructorList){
        this.courseOfferingId = id;
        this.location = location;
        this.semesterCode = semesterCode;
        this.instructors = instructorList;
        this.term = setTermByCode();
        this.year = setYearByCode();
    }

    private int setYearByCode() {
        int x, y, z;
        x = semesterCode / 1000;
        y = (semesterCode / 100) % 10;
        z = (semesterCode / 10) % 10;
        return 1900 + 100 * x + 10 * y + z;
    }

    private String setTermByCode() {
        int termCode = semesterCode % 10;
        return switch (termCode) {
            case 1 -> "Spring";
            case 4 -> "Summer";
            default -> "Fall";
        };
    }

    public int getCourseOfferingId() {
        return courseOfferingId;
    }

    public String getLocation() {
        return location;
    }
    public int getSemesterCode() {
        return semesterCode;
    }
    public List<Instructor> getInstructors(){
        return instructors;
    }

    public int getYear() {
        return year;
    }

    public String getTerm() {
        return term;
    }

    public List<Section> getSections() {
        return sections;
    }

    public Boolean hasInstructor (String name){
        for(Instructor instructor : instructors){
            if(name.equals(instructor.getName())){
                return true;
            }
        }
        return false;
    }

    public void addInstructor(String name) {
        instructors.add(new Instructor(name));
    }

    public void addSection(String componentCode, int enrolCap, int enrolTotal){
        for(Section section : sections){
            if(componentCode.equals(section.getType())){
                section.addEnrollmentCapacity(enrolCap);
                section.addEnrollmentTotal(enrolTotal);
                return;
            }
        }
        Section section = new Section(componentCode, enrolCap, enrolTotal);
        sections.add(section);
    }

    public void printSection() {
        for(Section section : sections){
            System.out.printf("%15s%s, Enrollment=%d/%d", "Type=",
                    section.getType(),
                    section.getEnrollmentTotal(),
                    section.getEnrollmentCapacity());
            System.out.println();
        }
    }

    public List<ApiOfferingSectionWrapper> getAllSectionToAPI(){
        List<ApiOfferingSectionWrapper> wrappers = new ArrayList<>();
        for(Section section : sections){
            wrappers.add(section.loadDataToSectionWrapper());
        }
        return wrappers;
    }

    public ApiCourseOfferingWrapper loadDataToOfferingWrapper() {
        String instructors = "";
        ApiCourseOfferingWrapper wrapper = new ApiCourseOfferingWrapper();
        wrapper.courseOfferingId = getCourseOfferingId();
        wrapper.location = getLocation();
        wrapper.semesterCode = getSemesterCode();
        wrapper.term = getTerm();
        wrapper.year = getYear();
        List<Instructor> prof = getInstructors();
        for(int i = 0; i < prof.size(); i++){
            Instructor nextInstructor = null;
            if(i < prof.size() - 1) {
                nextInstructor = prof.get(i + 1);
            }
            instructors += prof.get(i).getName();
            if(nextInstructor != null
                    && nextInstructor.getName().equals("")){
                continue;
            }
            if(i != prof.size() - 1){
                instructors += COMMA_WITH_SPACE;
            }
        }
        wrapper.instructors = instructors;
        return wrapper;
    }
}
