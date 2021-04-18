package poc.executors;

import java.util.Iterator;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

public class MyMainProgram {

    public static boolean keepRunning = true;

    private static final int MAX_LOOP = 500;
    private static int loopCount = 0;

    private static ExecutorService executor = Executors.newSingleThreadExecutor();
    private static List<Future<String>> futures = new CopyOnWriteArrayList<Future<String>>();

    public static void main(String[] args) throws Exception {
        Thread.currentThread().setName("Main Thread: ");
        Iterator<Future<String>> it = futures.iterator();
        while(keepRunning && (loopCount < MAX_LOOP)) {
            loopCount++;
            System.out.println(Thread.currentThread().getName() +  ": Still running");

            //some logic - submit a task for every 500 count

            if(loopCount % 50 == 0) {
                futures.add(executor.submit(new MySampleTask()));
            }
            for (Future<String> f: futures) {
                if(f.isDone()) {
                    System.out.println(f.get());
                    futures.remove(f);
                }
            }
            Thread.sleep(50);
        }
        System.exit(1);
    }
}
