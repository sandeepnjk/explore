package poc.executors;

        import java.util.UUID;
        import java.util.concurrent.Callable;

public class MySampleTask implements Callable<String> {

    @Override
    public String call() {
        Thread.currentThread().setName("MySampleTask Thread " + UUID.randomUUID() + ": ");
        return doSomething();
    }

    private String doSomething() {
        return Thread.currentThread().getName() + " I did something";
    }
}
