package ca.cmpt213.model;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

/**
 * This class takes the responsibility to read file when required
 * It has stores it own filePath
 * Immutable class
 */
public class ReadFile {
    private final String filePath;
    private final DepartmentManager deptManager = new DepartmentManager();
    public ReadFile(String filePath){
        this.filePath = filePath;
    }

    public void extractDataFromFile() throws IOException {
        BufferedReader reader = new BufferedReader(new FileReader(filePath));
        String line = reader.readLine();
        while((line = reader.readLine()) != null){
            String[] data = line.split(",");
            insertDataFromLine(data);
        }
        reader.close();
    }

    private void insertDataFromLine(String[] data) {
        for(String str : data){
            str = str.strip();
        }
        int semester = Integer.parseInt(data[0]);
        String deptName = data[1];
        String catalogNumber = data[2];
        String location = data[3];
        int enrolCap = Integer.parseInt(data[4]);
        int enrolTotal = Integer.parseInt(data[5]);
        String instructor = "";
        for(int i = 6; i < data.length - 1; i++){
            instructor += data[i];
            if((i + 1) != (data.length - 1)){
                instructor += ", ";
            }
        }
        String componentCode = data[data.length - 1];
        deptManager.addDataToDepartment(semester, deptName, catalogNumber, location, enrolCap, enrolTotal, instructor, componentCode);
    }
}
