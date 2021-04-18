package poc.streams;

public class Employee {
    private Integer empId;
    private String name;
    private Double salary;

    public Employee(int employeeId, String name, double salary) {
        this.empId = employeeId;
        this.name =  name;
        this.salary = salary;

    }

    @Override
    public String toString() {
        return "Employee{" +
                "empId=" + empId +
                ", name='" + name + '\'' +
                ", salary=" + salary +
                '}';
    }

    public Integer getEmpId() {
        return empId;
    }

    public void setEmpId(Integer empId) {
        this.empId = empId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public void salaryIncrement(int incrementPercent) {

        salary += salary*incrementPercent/100;

    }
        
}
    