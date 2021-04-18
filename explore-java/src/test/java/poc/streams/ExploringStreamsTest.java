package poc.streams;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertEquals;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.hamcrest.Matchers.contains;
import static org.hamcrest.beans.HasPropertyWithValue.hasProperty;
import static org.hamcrest.MatcherAssert.assertThat;


import org.junit.Before;
import org.junit.Test;

import java.util.*;
import java.util.function.BinaryOperator;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class ExploringStreamsTest {

    private static Employee[] employee_array  = {
            new Employee(1, "marwin", 10000),
            new Employee(2, "peter", 15000),
            new Employee(3, "gabriel", 30000),
            new Employee(4, "marxcusmarco", 40000),
            new Employee(5, "divalo", 35000),

    };

    private static List<Employee> empList;
    private static EmployeeRepository employeeRepository;

    @Before
    public void resetEmployeeSalaries() {
        employee_array[0].setSalary(10000d);
        employee_array[1].setSalary(15000d);
        employee_array[2].setSalary(30000d);
        employee_array[3].setSalary(40000d);
        employee_array[4].setSalary(35000d);
        empList = Arrays.asList(employee_array);
        employeeRepository =  new EmployeeRepository(empList);

    }




    @Test
    public void testCreateStreamFromArray() {
        assert(Stream.of(employee_array) instanceof Stream<?>);
    }

    @Test
    public void testCreatStreamFromList() {

       assert(empList.stream() instanceof Stream<?>);
    }

    @Test
    public void testCreateStreamsFromStreamBuilders() {
        Stream.Builder<Employee> empStreamBuilder =  Stream.builder();
        for (Employee anEmployee_array : employee_array) {
            empStreamBuilder.accept(anEmployee_array);
        }
        assert(empStreamBuilder.build() instanceof Stream<?>);

    }

    @Test
    public void testForEachUsingStreams() {
        Double[] empSalArray = {
                        employee_array[0].getSalary(),
                        employee_array[1].getSalary(),
                        employee_array[2].getSalary(),
                        employee_array[3].getSalary(),
                        employee_array[4].getSalary()};
        empList.stream().forEach(e -> e.salaryIncrement(10));
        assert(employee_array[0].getSalary().equals(empSalArray[0]*110/100));
        assert(employee_array[1].getSalary().equals(empSalArray[1]*110/100));
        assert(employee_array[2].getSalary().equals(empSalArray[2]*110/100));
        assert(employee_array[3].getSalary().equals(empSalArray[3]*110/100));
        assert(employee_array[4].getSalary().equals(empSalArray[4]*110/100));
    }

    @Test
    public void testStreamsAreForOneTimeUse() {
        Stream<Employee> empStream = empList.stream();
        empStream.forEach(e -> e.salaryIncrement(10));
        try {
            empStream.forEach(e -> e.salaryIncrement(10));
        } catch (Exception ex) {
            assert(true);
        }
    }

    @Test
    public void testUsingSuppliersToGetStreams() {
        Supplier<Stream<Employee>> empStreamSupplier = () -> Stream.of(employee_array);
        empStreamSupplier.get().forEach(e -> e.salaryIncrement(10));
        empStreamSupplier.get().forEach(e -> e.salaryIncrement(10));
        assert(true);
    }

    @Test
    public void testCollectToGetListfromStream() {
        List<Employee> newEmpList = empList.stream().collect(Collectors.toList());
        assertEquals(empList, newEmpList);
        assertEquals(empList.get(1), newEmpList.get(1));
        assert(empList.equals(newEmpList));
    }

    @Test
    public void testMapToCreateNewStreamAfterApplyingFunction() {
        Integer[] empIds =  {1,2,3};
        List<Employee> subsetEmpList = Stream.of(empIds)
                .map(employeeRepository::findById)
                .collect(Collectors.toList());
        assertEquals(subsetEmpList.size(), empIds.length);
    }

    @Test
    public void testFilterToGetNewStreamWithPredicate() {
        Integer[] empIds =  {1,2,3,4};
        List<Employee> employees =  Stream.of(empIds)
                .map(employeeRepository::findById)
                .filter(e -> e != null)
                .filter(e -> e.getSalary() > 35000)
                .collect(Collectors.toList());
        assertEquals(Arrays.asList(employee_array[3]), employees);
    }

    @Test
    public void testFindFirstEmployeeWithCertainSalary() {
        Integer[] empIds =  {1,2,3,4};
        Employee employee =  Stream.of(empIds)
                .map(employeeRepository::findById)
                .filter(e -> e != null)
                .filter(e -> e.getSalary() > 25000)
                .findFirst()
                .orElse(null);
        assertEquals(employee.getSalary(), Double.valueOf(30000));
    }

    @Test
    public void testStreamToArray() {
        Employee[] employees = empList.stream().toArray(Employee[]::new);
        assertThat(empList.toArray(), equalTo(employees));

    }

    @Test
    public void testStreamFlatMap() {
        List<List<String>> nestedNames = Arrays.asList(
                Arrays.asList("one", "two"),
                Arrays.asList("three", "four"),
                Arrays.asList("five", "six"),
                Arrays.asList("seven", "eight"));
        List<String> namesFlattened =  nestedNames.stream()
                .flatMap(Collection::parallelStream)
                .collect(Collectors.toList());
        assertEquals(namesFlattened.size(), nestedNames.size() * 2);
    }

    @Test
    public void testStreamPeekForMultipleOperations() {

        empList.stream()
                .peek(e -> e.salaryIncrement(10))
                .peek(System.out::println)
                .collect(Collectors.toList());



        assertThat(empList, contains(
                hasProperty("salary", equalTo(11000.0)),
                hasProperty("salary", equalTo(16500.0)),
                hasProperty("salary", equalTo(33000.0)),
                hasProperty("salary", equalTo(44000.0)),
                hasProperty("salary", equalTo(38500.0))
        ));
    }

    @Test
    public void testStreamFilterAndCount() {
        Long empCount = empList.stream()
                .filter(e -> e.getSalary() > 20000) //intermediate stream operation, they are lazy
                .count(); //Terminal Stream Operation

        assertEquals(empCount, Long.valueOf(3));
    }

    @Test
    public void testStreamLazyEvaluationForIntermediateOperations() {
        Integer[] empids = {1,2,3,4};
        Employee employee = Stream.of(empids)
                .map(employeeRepository::findById)
                .filter(e -> e != null)
                .filter(e -> e.getSalary() > 20000)
                .findFirst()
                .orElse(null);
        assertEquals(employee.getSalary(), Double.valueOf(30000));
    }


    @Test
    public void testStreamShortCircuitOperations() {
        Stream<Integer> infiniteStream =  Stream.iterate(2, i -> i * 2);
        List<Integer> collect = infiniteStream
                .skip(3) //short circuit stream operations
                .limit(5) //short circuit stream operations
                .collect(Collectors.toList());
        assertEquals(collect, Arrays.asList(16, 32, 64, 128,256));
    }

    @Test
    public void testStreamSorting() {
        List<Employee> employees = empList.stream()
                .sorted((e1, e2) -> e1.getName().compareTo(e2.getName()))
                .collect(Collectors.toList());
        assertEquals(employees.get(0).getName(), "divalo");
        assertEquals(employees.get(1).getName(), "gabriel");
        assertEquals(employees.get(2).getName(), "marwin");

    }

    @Test
    public void testStreamMinMax() {
        Employee employee = empList.stream()
                .min((e1, e2) -> e1.getSalary().compareTo(e2.getSalary()))
                .orElseThrow(NoSuchElementException::new);
        assertEquals(employee.getSalary(), Double.valueOf(10000));

        employee = empList.stream()
                .max((e1, e2) -> e1.getSalary().compareTo(e2.getSalary()))
                .orElseThrow(NoSuchElementException::new);
        assertEquals(employee.getSalary(), Double.valueOf(40000));
    }

    @Test
    public void testStreamDistinct() {
        List<Integer> intList =  Arrays.asList(2, 4, 2, 5, 3, 7, 4, 6);
        List<Integer> distIntList =  intList.stream().distinct().collect(Collectors.toList());

        assertEquals(distIntList, Arrays.asList(2, 4, 5, 3, 7, 6));
    }

    @Test
    public void testStreamXxxMatch() {
        List<Integer> intList = Arrays.asList(2, 4, 5, 6, 8);

        boolean allEven = intList.stream().allMatch(i -> i % 2 == 0);
        boolean anyEven = intList.stream().anyMatch(i -> i % 2 == 0);
        boolean noneMultipleOfThree = intList.stream().noneMatch(i -> i % 3 == 0);

        assertEquals(allEven, false);
        assertEquals(anyEven, true);
        assertEquals(noneMultipleOfThree, false);
    }

    @Test
    public void testIntStreamMax() {
        Integer latestEpmId =  empList.stream()
                .mapToInt(Employee::getEmpId).max()
                .orElseThrow(NoSuchElementException::new);
        assertEquals(latestEpmId, Integer.valueOf(5));

    }

    @Test
    public void testCreateIntStream() {
        assert(IntStream.of(1,3,4,5) instanceof IntStream);
        assert(IntStream.range(10, 100) instanceof IntStream);
        //Note: Stream.of(1,3,4,5) return Stream<Integer> not IntStream
        //Note: Stream.of(1,3,4,5).map(Employee::getId) return Stream<Integer> and not IntStream

    }

    @Test
    public void testDoubleStreamSumAverage() {
        Double totalSalary =  empList.stream().mapToDouble(Employee::getSalary).sum();
        Double avgSalary =  empList.stream().mapToDouble(Employee::getSalary).average().orElseThrow(NoSuchElementException::new);

        assertEquals(totalSalary, Double.valueOf(130000));
        assertEquals(avgSalary, Double.valueOf(130000/5));
        //353312072481247

    }

    @Test
    public void testStreamReduce() { //note: this is nothing but a DoubleStream.sum() implementation.
        Double sumSal =  empList.stream()
                .map(Employee::getSalary)
                .reduce(0.0, Double::sum);
        assertEquals(sumSal,Double.valueOf(130000));
    }

    @Test
    public void testStreamCollectByJoining() {
        String empNames =  empList.stream()
                .map(Employee::getName)
                .collect(Collectors.joining(", "))
                .toString();

        assertEquals(empNames, "marwin, peter, gabriel, marxcusmarco, divalo");

    }

    @Test
    public void testStreamCollectBySet() {
        Set<String> empNames = empList.stream()
                .map(Employee::getName)
                .collect(Collectors.toSet());
        assertEquals(empNames.size(),5);

    }

    @Test
    public void testStreamCollectToVector() {
        Vector<String> empNames =  empList.stream()
                .map(Employee::getName)
                .collect(Collectors.toCollection(Vector::new));
        assertEquals(empNames.size(),5);
    }

    @Test
    public void testStreamSummarizingDouble(){
        DoubleSummaryStatistics stats =  empList.stream()
                .collect(Collectors.summarizingDouble(Employee::getSalary));
        assertEquals(stats.getCount(), 5);
        assertEquals(stats.getSum(), 130000, 0);
        assertEquals(stats.getMin(), 10000, 0);
        assertEquals(stats.getMax(), 40000, 0);
        assertEquals(stats.getAverage(), Double.valueOf(130000/5), 0);

        //note: can be used with specialized streams too, DoubleStream

    }

    @Test
    public void testStreamCollectByPartition() {
        List<Integer> intList =  Arrays.asList(2, 4, 5, 6, 8);
        Map<Boolean, List<Integer>> isEven = intList.stream()
                .collect(Collectors.partitioningBy(i -> i % 2 == 0));

        assertEquals(isEven.get(true).size() , 4);
        assertEquals(isEven.get(false).size(), 1);
    }

    @Test
    public void testStreamGroupingBy() {
        Map<Character, List<Employee>> groupingByAlphabet =  empList.stream()
                .collect(Collectors.groupingBy(i -> new Character(i.getName().charAt(0))));
        assertEquals(groupingByAlphabet.get('m').get(0).getName(), "marwin");
        assertEquals(groupingByAlphabet.get('m').get(1).getName(), "marxcusmarco");
        assertEquals(groupingByAlphabet.get('p').get(0).getName(), "peter");
        assertEquals(groupingByAlphabet.get('g').get(0).getName(), "gabriel");
        assertEquals(groupingByAlphabet.get('d').get(0).getName(), "divalo");

    }

    @Test
    public void testStreamMapping() {
        Map<Character, List<Integer>> idGroupedBtAlphabet = empList.stream().collect(
                        Collectors.groupingBy(e -> Character.valueOf(e.getName().charAt(0)),
                                Collectors.mapping(Employee::getEmpId, Collectors.toList())));
        assertEquals(idGroupedBtAlphabet.get('m').get(0), Integer.valueOf(1));
        assertEquals(idGroupedBtAlphabet.get('m').get(1), Integer.valueOf(4));
        assertEquals(idGroupedBtAlphabet.get('p').get(0), Integer.valueOf(2));
        assertEquals(idGroupedBtAlphabet.get('g').get(0), Integer.valueOf(3));
        assertEquals(idGroupedBtAlphabet.get('d').get(0), Integer.valueOf(5));

    }

    @Test
    public void testStreamReducing() {
        Double percentage =  10.0;
        Double salIncOverhead =  empList.stream().collect(
          Collectors.reducing(0.0, e -> e.getSalary() * percentage / 100, (s1, s2) -> s1 + s2));
        assertEquals(salIncOverhead, Double.valueOf(13000.0));
    }

    @Test
    public void testStreamGroupingAndReducing() {
        Comparator<Employee> byNameLength =  Comparator.comparing(Employee::getName);
        Map<Character, Optional<Employee>> longestNameEmployee =  empList.stream().collect(
          Collectors.groupingBy( e -> Character.valueOf(e.getName().charAt(0)),
                  Collectors.reducing(BinaryOperator.maxBy(byNameLength))));
        assertEquals(longestNameEmployee.get('m').get().getName(), "marxcusmarco");

    }


    
}

