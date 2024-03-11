package ca.cmpt213.observer;

import ca.cmpt213.model.Course;
import ca.cmpt213.model.CourseOffering;
import ca.cmpt213.model.Department;

public interface CourseChangeObserver {
    void stateChanged(Department dept, Course course, CourseOffering offering, String componentCode, int enrolCap, int enrolTotal);
}
