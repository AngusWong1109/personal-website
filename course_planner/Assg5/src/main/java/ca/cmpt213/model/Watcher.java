package ca.cmpt213.model;

import ca.cmpt213.observer.CourseChangeObserver;
import ca.cmpt213.restapi.ApiWatcherWrapper;

import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * This class is the watcher that the user used to monitor the course that they would want to focus on
 * And the watcher will be updated when any section has been added to the course
 */

public class Watcher {
    DepartmentManager deptManager = new DepartmentManager();
    private final int watcherId;
    private final Department department;
    private final Course course;
    private final List<String> events = new ArrayList<>();

    public Watcher (int watcherId, Department dept, Course course){
        this.watcherId = watcherId;
        this.department = dept;
        this.course = course;
        course.setHasWatcher(true);
        registerAsObserver();
    }

    public Department getDepartment() {
        return department;
    }

    public Course getCourse() {
        return course;
    }

    private void registerAsObserver(){
       deptManager.addObserver(new CourseChangeObserver() {
            @Override
            public void stateChanged(Department dept, Course courses, CourseOffering offering, String componentCode, int enrolCap, int enrolTotal) {
                if(dept.equals(department)
                && course.equals(courses)) {
                    addEvent(offering, componentCode, enrolCap, enrolTotal);
                }
            }
        });
    }

    public int getWatcherId() {
        return watcherId;
    }

    public void addEvent(CourseOffering offering, String componentCode, int enrolCap, int enrolTotal){
        ZonedDateTime date = ZonedDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEE MMM dd HH:mm:ss zz yyyy");
        String msg = date.format(formatter) + ": Added section " + componentCode + " with enrollment ("
                + enrolTotal + "/" + enrolCap + ") to offering " + offering.getTerm() + " " + offering.getYear();
        events.add(msg);
    }

    public ApiWatcherWrapper loadDataToWatcherWrapper(){
        ApiWatcherWrapper wrapper = new ApiWatcherWrapper();
        wrapper.id = getWatcherId();
        wrapper.department = department.loadDataToDeptWrapper();
        wrapper.course = course.loadDataToCourseWrapper();
        wrapper.events = events;
        return wrapper;
    }

    @Override
    public boolean equals(Object obj) {
        if(this == obj){
            return true;
        }
        if(! (obj instanceof Watcher watcher)){
            return false;
        }
        return Objects.equals(watcherId, watcher.getWatcherId())
                && Objects.equals(department, watcher.getDepartment())
                && Objects.equals(course, watcher.getCourse());
    }
}
