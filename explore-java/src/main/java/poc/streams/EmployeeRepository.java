package poc.streams;

import java.util.List;

public class EmployeeRepository {
    private List<Employee> empList;

    public EmployeeRepository(List<Employee> empList) {
        this.empList = empList;
    }

    public Employee findById(Integer empId) {
        Employee result = null;
        for (Employee emp: this.empList) {
            if (emp.getEmpId() == empId) {
                result = emp;
                break;
            }
        }
        return result;

    }
}
