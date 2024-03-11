package ca.cmpt213.model;

import ca.cmpt213.restapi.ApiCourseOfferingWrapper;
import ca.cmpt213.restapi.ApiCourseWrapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * This class stores the information about each course
 * Each course has 1 or many course offerings
 * And each course has its coursedId, and catalogNumber
 * It also stores whether it has a watcher
 */

public class Course {
    private static final AtomicInteger nextCourseOfferingId = new AtomicInteger();
    private int courseId;
    private String catalogNumber;
    private boolean hasWatcher = false;
    private final List<CourseOffering> offerings = new ArrayList<>();
    private static final String COMMA = ",";
    private static final String DOUBLE_QUOTE = "\"";
    private static final String COMMA_WITH_SPACE = ", ";

    public Course(){
    }

    public Course(int courseId, String catalogNumber) {
        this.courseId = courseId;
        this.catalogNumber = catalogNumber;
    }

    public int getCourseId() {
        return courseId;
    }

    public String getCatalogNumber() {
        return catalogNumber;
    }

    public List<CourseOffering> getOfferings() {
        return offerings;
    }

    public boolean isHasWatcher() {
        return hasWatcher;
    }

    public void setHasWatcher(boolean hasWatcher) {
        this.hasWatcher = hasWatcher;
    }

    public CourseOffering findCourseOfferingById (int id){
        for(CourseOffering offering : offerings){
            if(offering.getCourseOfferingId() == id){
                return offering;
            }
        }
        return null;
    }

    public CourseOffering findCourseOfferingByInfo(String location, int semesterCode){
        for(CourseOffering offering : offerings){
                if(offering.getLocation().equals(location) &&
                        offering.getSemesterCode() == semesterCode){
                    return offering;
                }
        }
        return null;
    }

    public void addCourseOfferings (String location, int semesterCode, String instructor){
        CourseOffering offering = findCourseOfferingByInfo(location, semesterCode);
        List<Instructor> instructorList = handleInstructor(instructor);
        if(offering != null){
            for(Instructor professor : instructorList){
                if(! offering.hasInstructor(professor.getName())){
                    offering.addInstructor(professor.getName());
                }
            }
        }
        else {
            int id = nextCourseOfferingId.incrementAndGet();
            offering = new CourseOffering(id, location, semesterCode, instructorList);
            offerings.add(offering);
        }
    }

    private List<Instructor> handleInstructor(String instructor) {
        List<Instructor> instructorList = new ArrayList<>();
        if(instructor.equals("(null)") ||
                instructor.equals("<null>")){
            instructorList.add(new Instructor(""));
        }
        else if(hasMoreThanOneInstructor(instructor)){
            instructor = instructor.replaceAll(DOUBLE_QUOTE, "");
            instructorList = splitInstructor(instructor);
        }
        else {
            instructorList.add(new Instructor(instructor));
        }
        return instructorList;
    }

    private List<Instructor> splitInstructor(String instructor) {
        List<Instructor> instructorList = new ArrayList<>();
        String[] instructors = instructor.split(COMMA);
        for(String str : instructors){
            instructorList.add(new Instructor(str.strip()));
        }
        return instructorList;
    }

    private boolean hasMoreThanOneInstructor(String instructor) {
        return instructor.contains(COMMA);
    }

    public void printCourseOfferings() {
        for(CourseOffering offering : offerings) {
            System.out.printf("%10d in %s by ", offering.getSemesterCode(), offering.getLocation());
            List<Instructor> instructors = offering.getInstructors();
            for(int i = 0; i < instructors.size(); i++){
                Instructor nextInstructor = null;
                if(i < instructors.size() - 1) {
                    nextInstructor = instructors.get(i + 1);
                }
                System.out.print(instructors.get(i).getName());
                if(nextInstructor != null
                && nextInstructor.getName().equals("")){
                    continue;
                }
                if(i != instructors.size() - 1){
                    System.out.print(COMMA_WITH_SPACE);
                }
            }
            System.out.println();
            offering.printSection();
        }
    }

    public List<ApiCourseOfferingWrapper> getAllOfferingsToAPI(){
        List<ApiCourseOfferingWrapper> wrappers = new ArrayList<>();
        for(CourseOffering offering : offerings){
            wrappers.add(offering.loadDataToOfferingWrapper());
        }
        return wrappers;
    }

    public ApiCourseWrapper loadDataToCourseWrapper(){
        ApiCourseWrapper wrapper = new ApiCourseWrapper();
        wrapper.courseId = getCourseId();
        wrapper.catalogNumber = getCatalogNumber();
        return wrapper;
    }

    @Override
    public boolean equals(Object obj) {
        if(obj == this){
            return true;
        }
        if(! (obj instanceof Course course)){
            return false;
        }
        return Objects.equals(courseId, course.getCourseId())
                && Objects.equals(catalogNumber, course.getCatalogNumber());
    }
}
