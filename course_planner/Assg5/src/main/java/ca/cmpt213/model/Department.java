package ca.cmpt213.model;

import ca.cmpt213.restapi.ApiCourseWrapper;
import ca.cmpt213.restapi.ApiDepartmentWrapper;
import ca.cmpt213.restapi.ApiSemesterWrapper;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * This class stores all information about each department
 * Each department has its own unique department id (deptId), and it's own department name (name)
 * Each department has 1 or more courses and semester that it has opened for enrollment.
 */
public class Department {
    private static final AtomicInteger nextCourseId = new AtomicInteger();
    private int deptId;
    private String name;
    private final List<Course> courses = new ArrayList<>();
    private final List<Semester> semesters = new ArrayList<>();

    public Department(){
    }

    public Department(int deptId, String name) {
        this.deptId = deptId;
        this.name = name;
    }

    public int getDeptId() {
        return deptId;
    }

    public String getName() {
        return name;
    }

    public List<Course> getCourses(){
        return courses;
    }

    public Course findCourseById(int id){
        for(Course course : courses){
            if(course.getCourseId() == id){
                return course;
            }
        }
        return null;
    }

    public Course findCourseByCatalogNumber (String catalogNumber){
        for(Course course : courses){
            if(course.getCatalogNumber().equals(catalogNumber)){
                return course;
            }
        }
        return null;
    }

    public void addCourse(String catalogNumber){
        if(hasCourse(catalogNumber)){
            return;
        }
        int id = nextCourseId.incrementAndGet();
        Course course = new Course(id, catalogNumber);
        courses.add(course);
    }

    public void addSemester(int semesterCode){
        for(Semester semester : semesters){
            if(semester.getSemesterCode() == semesterCode){
                return;
            }
        }
        semesters.add(new Semester(this, semesterCode));
    }

    public List<ApiSemesterWrapper> getAllSemesterInfo(){
        List<ApiSemesterWrapper> wrappers = new ArrayList<>();
        addNonExistSemester();
        sortBySemesterCode();
        for(Semester semester : semesters){
            wrappers.add(semester.loadDataToSemesterWrapper());
        }
        return wrappers;
    }

    private void addNonExistSemester() {
        int minSemester, maxSemester, currentSemesterCode, nextSemesterCode;
        sortBySemesterCode();
        minSemester = semesters.get(0).getSemesterCode();
        maxSemester = semesters.get(semesters.size() - 1).getSemesterCode();
        currentSemesterCode = addOneTerm(minSemester);
        do{
            if(! semesterExist(currentSemesterCode)){
                semesters.add(new Semester(this, currentSemesterCode));
            }
            nextSemesterCode = addOneTerm(currentSemesterCode);
            currentSemesterCode = nextSemesterCode;
        }while(nextSemesterCode > minSemester && nextSemesterCode < maxSemester);
    }

    private int addOneTerm(int currentSemesterCode) {
        int nextSemesterCode, currentTerm, nextTerm;
        currentTerm = currentSemesterCode % 10;
        nextTerm = currentTerm + 3;
        if(nextTerm == 10){
            nextSemesterCode = currentTerm + 4;
        }
        else{
            nextSemesterCode = currentSemesterCode + 3;
        }
        return nextSemesterCode;
    }

    private boolean semesterExist(int currentSemesterCode) {
        for(Semester semester : semesters){
            if(semester.getSemesterCode() == currentSemesterCode){
                return true;
            }
            else if(semester.getSemesterCode() > currentSemesterCode){
                return false;
            }
        }
        return false;
    }

    private Boolean hasCourse(String catalogNumber){
        for(Course course : courses){
            if(course.getCatalogNumber().equals(catalogNumber)){
                return true;
            }
        }
        return false;
    }

    public void printCourse() {
        for(Course course : courses){
            System.out.println(name + course.getCatalogNumber());
            course.printCourseOfferings();
        }
    }

    public List<ApiCourseWrapper> getAllCourseToAPI(){
        List<ApiCourseWrapper> wrappers = new ArrayList<>();
        for(Course course : courses){
            wrappers.add(course.loadDataToCourseWrapper());
        }
        return wrappers;
    }

    public ApiDepartmentWrapper loadDataToDeptWrapper(){
        ApiDepartmentWrapper deptWrapper = new ApiDepartmentWrapper();
        deptWrapper.deptId = getDeptId();
        deptWrapper.name = getName();
        return deptWrapper;
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj){
            return true;
        }
        if(!(obj instanceof Department dept)){
            return false;
        }
        return Objects.equals(name, dept.getName())
                && Objects.equals(deptId, dept.getDeptId());
    }

    public void sortBySemesterCode(){
        Collections.sort(semesters, new SortSemester());
    }

    class SortSemester implements Comparator<Semester>{

        @Override
        public int compare(Semester o1, Semester o2) {
            return o1.getSemesterCode() - o2.getSemesterCode();
        }
    }
}
