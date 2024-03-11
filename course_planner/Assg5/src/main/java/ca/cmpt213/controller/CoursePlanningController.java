package ca.cmpt213.controller;

import ca.cmpt213.model.*;
import ca.cmpt213.restapi.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class CoursePlanningController {
    private final DepartmentManager deptManager = new DepartmentManager();
    private final WatcherManager watcherManager = new WatcherManager();
    private static final String DEPT_ERROR_MSG = "Department not found";
    private static final String COURSE_ERROR_MSG = "Course not found";
    private static final String OFFERING_ERROR_MSG = "Course offering not found";
    @GetMapping("/api/about")
    public ApiAboutWrapper simpleDescription(){
        return new ApiAboutWrapper("Course planning application", "Angus Wong");
    }

    @GetMapping("/api/dump-model")
    public void printClass(){
        deptManager.printInfo();
    }
    private void checkValue(Object object, String msg){
        if(object == null){
            throw new BadRequest(msg);
        }
    }

    @GetMapping("/api/departments")
    public List<ApiDepartmentWrapper> getAllDepartments(){
        return deptManager.getAllDepartmentToAPI();
    }

    @GetMapping("/api/departments/{id}/courses")
    public List<ApiCourseWrapper> getAllCourses(@PathVariable("id") int deptId){
        Department dept = deptManager.findDepartmentById(deptId);
        checkValue(dept, DEPT_ERROR_MSG);
        return dept.getAllCourseToAPI();
    }

    @GetMapping("/api/departments/{deptId}/courses/{courseId}/offerings")
    public List<ApiCourseOfferingWrapper> getAllCourseOfferings(@PathVariable("deptId") int deptId,
                                                                @PathVariable("courseId") int courseId){
        Department dept = deptManager.findDepartmentById(deptId);
        checkValue(dept, DEPT_ERROR_MSG);
        Course course = dept.findCourseById(courseId);
        checkValue(course, COURSE_ERROR_MSG);
        return course.getAllOfferingsToAPI();
    }

    @GetMapping("/api/departments/{deptId}/courses/{courseId}/offerings/{offeringId}")
    public List<ApiOfferingSectionWrapper> getAllSection(@PathVariable("deptId") int deptId,
                                                         @PathVariable("courseId") int courseId,
                                                         @PathVariable("offeringId") int offeringId){
        List<ApiOfferingSectionWrapper> wrappers = new ArrayList<>();
        Department dept = deptManager.findDepartmentById(deptId);
        checkValue(dept, DEPT_ERROR_MSG);
        Course course = dept.findCourseById(courseId);
        checkValue(course, COURSE_ERROR_MSG);
        CourseOffering offering = course.findCourseOfferingById(offeringId);
        checkValue(offering, OFFERING_ERROR_MSG);
        return offering.getAllSectionToAPI();
    }

    @GetMapping("/api/stats/students-per-semester")
    public List<ApiSemesterWrapper> getStats(@RequestParam ("deptId") int deptId){
        Department dept = deptManager.findDepartmentById(deptId);
        return dept.getAllSemesterInfo();
    }

    @PostMapping("/api/addoffering")
    @ResponseStatus(value = HttpStatus.CREATED)
    public ApiCourseOfferingWrapper addOffering(@RequestBody ApiOfferingDataWrapper data){
        int semesterCode = Integer.parseInt(data.semester);
        deptManager.addDataToDepartment(
                semesterCode,
                data.subjectName,
                data.catalogNumber,
                data.location,
                data.enrollmentCap,
                data.enrollmentTotal,
                data.instructor,
                data.component);
        Department dept = deptManager.findDepartmentByName(data.subjectName);
        checkValue(dept, DEPT_ERROR_MSG);
        Course course = dept.findCourseByCatalogNumber(data.catalogNumber);
        checkValue(course, COURSE_ERROR_MSG);
        CourseOffering offering = course.findCourseOfferingByInfo(data.location, semesterCode);
        return offering.loadDataToOfferingWrapper();
    }

    @GetMapping("/api/watchers")
    public List<ApiWatcherWrapper> getAllWatchers(){
        return watcherManager.getAllWatchers();
    }

    @PostMapping("/api/watchers")
    @ResponseStatus(value = HttpStatus.CREATED)
    public ApiWatcherWrapper createWatcher(@RequestBody IdsWatcherWrapper wrapper){
        int deptId = wrapper.deptId;
        int courseId = wrapper.courseId;
        watcherManager.addWatcher(deptId, courseId);
        Watcher watcher = watcherManager.findWatcherByInfo(deptId, courseId);
        return watcher.loadDataToWatcherWrapper();
    }

    @GetMapping("/api/watchers/{id}")
    public ApiWatcherWrapper getOneWatcher(@PathVariable("id") int id){
        Watcher watcher = watcherManager.findWatcherByWatcherId(id);
        checkValue(watcher, "Watcher not found");
        return watcher.loadDataToWatcherWrapper();
    }

    @DeleteMapping("/api/watchers/{id}")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteWatcher(@PathVariable("id") int id){
        watcherManager.deleteWatcher(id);
    }

    //HttpStatus.NOT_FOUND = Error 404
    @ResponseStatus(code = HttpStatus.NOT_FOUND)
    public static class BadRequest extends RuntimeException{
        public BadRequest(){
        }

        public BadRequest(String errorMsg){
            super(errorMsg);
        }
    }
}
