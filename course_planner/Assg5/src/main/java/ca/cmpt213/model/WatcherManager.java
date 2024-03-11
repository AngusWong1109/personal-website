package ca.cmpt213.model;

import ca.cmpt213.restapi.ApiWatcherWrapper;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * This class stores and manage all the watcher
 * And distribute id for each watcher when they being created
 */

public class WatcherManager {
    private static final AtomicInteger nextId = new AtomicInteger();
    private final List<Watcher> watchers = new ArrayList<>();
    DepartmentManager deptManager = new DepartmentManager();

    public void addWatcher(int deptId, int courseId){
        if(watcherExisted(deptId, courseId)){
            return;
        }
        int id = nextId.incrementAndGet();
        Department department = deptManager.findDepartmentById(deptId);
        Course course = department.findCourseById(courseId);
        watchers.add(new Watcher(id, department, course));
    }

    private boolean watcherExisted(int deptId, int courseId){
        for(Watcher watcher : watchers){
            if(watcher.getDepartment().getDeptId() == deptId
            && watcher.getCourse().getCourseId() == courseId){
                return true;
            }
        }
        return false;
    }

    public void deleteWatcher(int watcherId){
        Watcher watcher = findWatcherByWatcherId(watcherId);
        watcher.getCourse().setHasWatcher(false);
        watchers.remove(watcher);
    }

    public List<ApiWatcherWrapper> getAllWatchers(){
        List<ApiWatcherWrapper> wrappers = new ArrayList<>();
        for(Watcher watcher : watchers){
            wrappers.add(watcher.loadDataToWatcherWrapper());
        }
        return wrappers;
    }

    public Watcher findWatcherByWatcherId(int id){
        for(Watcher watcher : watchers){
            if(watcher.getWatcherId() == id){
                return watcher;
            }
        }
        return null;
    }

    public Watcher findWatcherByInfo(int deptId, int courseId){
        for(Watcher watcher : watchers){
            if(watcher.getDepartment().getDeptId() == deptId
            && watcher.getCourse().getCourseId() == courseId){
                return watcher;
            }
        }
        return null;
    }
}
