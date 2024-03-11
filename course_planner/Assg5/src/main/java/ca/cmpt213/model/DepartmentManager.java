package ca.cmpt213.model;

import ca.cmpt213.observer.CourseChangeObserver;
import ca.cmpt213.restapi.ApiDepartmentWrapper;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * This class stores all the department in SFU
 * It stores the observers for the observer pattern
 * It will notify the observers when any data has been added into it.
 */
public class DepartmentManager {
    private static final AtomicInteger nextDeptId = new AtomicInteger();
    private static final List<Department> departments = new ArrayList<>();
    private static final List<CourseChangeObserver> observers = new ArrayList<>();

    public void addDepartment(String deptName){
        if(findDepartmentByName(deptName) != null){
            return;
        }
        int id = nextDeptId.incrementAndGet();
        departments.add(new Department(id, deptName));
    }

    public Department findDepartmentById(int deptId){
        for(Department department : departments){
            if(department.getDeptId() == deptId){
                return department;
            }
        }
        return null;
    }

    public Department findDepartmentByName(String name){
        for(Department dept : departments){
            if(dept.getName().equals(name)){
                return dept;
            }
        }
        return null;
    }

    public void printInfo(){
        for(Department dept : departments){
            dept.printCourse();
        }
    }

    public List<ApiDepartmentWrapper> getAllDepartmentToAPI(){
        List<ApiDepartmentWrapper> wrappers = new ArrayList<>();
        for(Department dept : departments){
            wrappers.add(dept.loadDataToDeptWrapper());
        }
        return wrappers;
    }

    public void addDataToDepartment(
            int semester,
            String deptName,
            String catalogNumber,
            String location,
            int enrolCap,
            int enrolTotal,
            String instructor,
            String componentCode){
        Department dept;
        Course course;
        CourseOffering offering;

        addDepartment(deptName);

        dept = findDepartmentByName(deptName);
        dept.addCourse(catalogNumber);
        dept.addSemester(semester);

        course = dept.findCourseByCatalogNumber(catalogNumber);
        course.addCourseOfferings(location, semester, instructor);

        offering = course.findCourseOfferingByInfo(location, semester);
        offering.addSection(componentCode, enrolCap, enrolTotal);

        if(course.isHasWatcher()) {
            notifyObservers(dept, course, offering, componentCode, enrolCap, enrolTotal);
        }
    }

    public void addObserver(CourseChangeObserver observer){
        observers.add(observer);
    }

    private void notifyObservers(Department dept, Course course, CourseOffering offering, String componentCode, int enrolCap, int enrolTotal){
        for(CourseChangeObserver observer : observers){
            observer.stateChanged(dept, course, offering, componentCode, enrolCap, enrolTotal);
        }
    }
}
