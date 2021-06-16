package main

import (
	"fmt"
	"math"

	"os"
	"strings"
	"time"

	"io"

	"image"
	"image/color"

	"sync"

	"math/rand"

	"golang.org/x/tour/pic"
	"golang.org/x/tour/reader"
	"golang.org/x/tour/tree"
	"golang.org/x/tour/wc"
)

//Concurrent Pattern: func that returns a channel
func boring(msg string) <-chan string { //returns recieve-only channel
	c := make(chan string)
	go func() {
		for i := 0; ; i++ {
			c <- fmt.Sprintf("%s %d\n", msg, i)
			time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
		}
	}()
	return c
}

// Channel Multiplexing

func fanIn(input1, input2 <-chan string) <-chan string {
	c := make(chan string)
	go func() {
		for {
			//time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
			c <- <-input1
		}
	}()
	go func() {
		for {
			time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
			c <- <-input2
		}
	}()
	return c
}

func channelMultiplexing() {
	c := fanIn(boring("Joe"), boring("Ann"))
	for i := 0; i < 10; i++ {
		fmt.Println(<-c)
	}
	fmt.Println("You're both boring; I am leaving..")
}

// ---------------------

// --- Channel Multiplexing ordered -----
type Message struct {
	str  string
	wait chan bool
}

func boring2(msg string) <-chan Message { //returns recieve-only channel
	waitForIt := make(chan bool)
	c := make(chan Message)
	go func() {
		for i := 0; ; i++ {
			c <- Message{fmt.Sprintf("%s %d\n", msg, i), waitForIt}
			time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
			<-waitForIt
		}
	}()
	return c
}

func fanIn2(input1, input2 <-chan Message) <-chan Message {
	c := make(chan Message)
	go func() {
		for {
			c <- <-input1
		}
	}()
	go func() {
		for {
			c <- <-input2
		}
	}()
	return c
}

func channelMultiplexingOrdered() {
	c := fanIn2(boring2("Joe"), boring2("Ann"))
	for i := 0; i < 5; i++ {
		msg1 := <-c
		fmt.Println(msg1.str)
		msg2 := <-c
		fmt.Println(msg2.str)
		msg1.wait <- true
		msg2.wait <- true
	}
	fmt.Println("You're both boring; I am leaving..")
}

// --------------------------

func channelAsFirstClassValue() {
	c := boring("very boring!")
	for i := 0; i < 5; i++ {
		fmt.Printf("You say: %q\n", <-c)
	}
	fmt.Println("You're boring; I am leaving..")
}

func channelAsHandleOnService() {
	joe := boring("Joe")
	ann := boring("ann")
	for i := 0; i < 5; i++ {
		fmt.Printf(<-joe)
		fmt.Printf(<-ann)
	}
	fmt.Println("You're both boring; I am leaving..")
}

//--- excercise web crawler, goroutine, mutex---------
type fakeResult struct {
	body string
	urls []string
}

type fakeFetcher map[string]*fakeResult

type fetchCache struct {
	mu sync.Mutex
	v  map[string]*fakeResult
}

func (fc fetchCache) get(url string) *fakeResult {
	fc.mu.Lock()
	defer fc.mu.Unlock()
	if res, ok := fc.v[url]; ok {
		fmt.Printf("CACHE-HIT: for url %v. result %v\n", url, res)
		return res
	} else {
		fmt.Printf("CACHE-MISS: for url %v\n", url)
		return nil
	}
}

func (fc fetchCache) add(url string, res *fakeResult) {
	fc.mu.Lock()
	defer fc.mu.Unlock()
	fmt.Printf("CACHE-ADD: for url %v, result = %v\n", url, res)
	fc.v[url] = res
}

var cache = fetchCache{v: make(map[string]*fakeResult)}

var fetcher = fakeFetcher{
	"https://golang.org/": &fakeResult{
		"The Go Programming Language",
		[]string{
			"https://golang.org/pkg/",
			"https://golang.org/cmd/",
		},
	},
	"https://golang.org/pkg/": &fakeResult{
		"Packages",
		[]string{
			"https://golang.org/",
			"https://golang.org/cmd/",
			"https://golang.org/pkg/fmt/",
			"https://golang.org/pkg/os/",
		},
	},
	"https://golang.org/pkg/fmt/": &fakeResult{
		"Package fmt",
		[]string{
			"https://golang.org/",
			"https://golang.org/pkg/",
		},
	},
	"https://golang.org/pkg/os/": &fakeResult{
		"Package os",
		[]string{
			"https://golang.org/",
			"https://golang.org/pkg/",
		},
	},
}

type Fetcher interface {
	Fetch(url string) (body string, urls []string, err error)
}

func (f fakeFetcher) Fetch(url string) (string, []string, error) {
	//check cache
	fr := cache.get(url)
	if fr == nil {
		//get from Fetcher
		if res, ok := f[url]; ok {
			cache.add(url, res)
			return res.body, res.urls, nil
		}
		return "", nil, fmt.Errorf("not-found: %s", url)
	} else {
		return fr.body, fr.urls, nil
	}
}

func Crawl(url string, depth int, fetcher Fetcher) {
	if depth <= 0 {
		return
	}
	body, urls, err := fetcher.Fetch(url)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Printf("found: %s %q\n", url, body)
	for _, u := range urls {
		Crawl(u, depth-1, fetcher)
	}
	return
}

func testWebCrawler() {
	go Crawl("https://golang.org/", 4, fetcher)
	go Crawl("https://golang.org/pkg/", 2, fetcher)
	time.Sleep(time.Second)
}

//------------
//--- using sync.Mutex, updating counters --------------
type SafeCounter struct {
	mu sync.Mutex
	v  map[string]int
}

func (c *SafeCounter) Inc(key string) {
	c.mu.Lock()
	c.v[key]++
	c.mu.Unlock()
}

func (c *SafeCounter) Value(key string) int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.v[key]
}

func testSafeCounter() {
	c := SafeCounter{v: make(map[string]int)}
	for i := 0; i < 1000; i++ {
		go c.Inc("testkey")
	}
	time.Sleep(time.Second)
	fmt.Println(c.Value("testkey"))
}

//--- Equivalent Binary trees
func Walk(t *tree.Tree, ch chan int) {
	inOrderTraversal(t, ch)
	close(ch)
}

func inOrderTraversal(t *tree.Tree, ch chan int) {
	if t != nil {
		inOrderTraversal(t.Left, ch)
		ch <- t.Value
		inOrderTraversal(t.Right, ch)
	}
}

func Same(t1, t2 *tree.Tree) bool {
	ch1, ch2 := make(chan int), make(chan int)
	go Walk(t1, ch1)
	go Walk(t2, ch2)

	for {
		n1, ok1 := <-ch1
		n2, ok2 := <-ch2

		if n1 != n2 || ok1 != ok2 {
			return false
		}
		if !ok1 {
			break
		}
	}
	return true
}

func testWalk() {

	t1 := tree.New(2)
	t2 := tree.New(2)
	t3 := tree.New(3)
	fmt.Println(Same(t1, t2))
	fmt.Println(Same(t1, t3))

}

//----------

//--- using default in select
func tickToBoom() {
	tick := time.Tick(100 * time.Millisecond)
	boom := time.After(500 * time.Millisecond)
	for {
		select {
		case <-tick:
			fmt.Println("tick.")
		case <-boom:
			fmt.Println("BOOM!")
			return
		default:
			fmt.Println("    .")
			time.Sleep(50 * time.Millisecond)
		}
	}
}

//------------------

//--- select and goroutine
func fibonacci3(c, quit chan int) {
	x, y := 0, 1
	for {
		select {
		case c <- x:
			x, y = y, x+y //send to channel c
		case <-quit: //receive from channel quit
			fmt.Println("quit")
			return
		}
	}
}

func testFibonacci3() {
	c := make(chan int)
	quit := make(chan int)
	go func() {
		for i := 0; i < 10; i++ {
			fmt.Println(<-c)
		}
		quit <- 0
	}()
	fibonacci3(c, quit)
}

//--- channel - range and close
func fibonacci2(n int, c chan int) {
	x, y := 0, 1
	for i := 0; i < n; i++ {
		c <- x
		x, y = y, x+y
	}
	close(c)
}

func testFibonacci2() {
	c := make(chan int, 10)
	go fibonacci2(cap(c), c)
	for i := range c {
		fmt.Println(i)
	}
}

//--- simple goroutine -------
func sum(s []int, c chan int) {
	sum := 0
	for _, v := range s {
		sum += v
	}
	c <- sum
}

func testGoroutine() {
	s := []int{7, 2, 8, -9, 4, 0}

	c := make(chan int)
	go sum(s[:len(s)/2], c)
	go sum(s[len(s)/2:], c)
	x, y := <-c, <-c

	fmt.Println(x, y, x+y) //-5 17 12

}

//----------------

//--- working with Images
type MyImage struct {
	width  int
	height int
}

func (m MyImage) ColorModel() color.Model {
	return color.RGBAModel
}

func (m MyImage) Bounds() image.Rectangle {
	return image.Rect(0, 0, m.width, m.height)
}

func (m MyImage) At(x, y int) color.Color {
	return color.RGBA{255, 255, 0, 255}
}

func testMyImage() {
	m := MyImage{100, 100}
	pic.ShowImage(m)
}

//--- rot13Reader excercise ------
type rot13Reader struct {
	r io.Reader
}

func rotate13(b byte) byte {
	if b >= 65 && b <= 77 {
		b = b + 13
	} else if b > 77 && b < 91 {
		b = (b - 77) + 64
	} else if b >= 97 && b <= 109 {
		b = b + 13
	} else if b > 109 && b < 123 {
		b = (b - 109) + 96
	} else {
		//no change
	}
	return b
}

func (r13 *rot13Reader) Read(b []byte) (int, error) {
	n, err := r13.r.Read(b)
	for i := 0; i < n; i++ {
		//fmt.Printf("[%d] before = %d", i, b[i])
		b[i] = rotate13(b[i])
		//fmt.Printf(" after = %d\n", b[i])
	}
	return n, err
}

func testRot13Reader() {
	s := strings.NewReader("Lbh penpxrq gur pbqr!")
	r := rot13Reader{s}
	io.Copy(os.Stdout, &r)
}

//-------

//--- implement a Reader thet emits stream of Ascii character 'A'
// in the Tour of Go the problem statement is ambigous due to the phrase 'infinite stream used'
type MyReader struct{}

func (r MyReader) Read(b []byte) (int, error) {
	for i := range b {
		b[i] = 65 //or 'A'
	}
	return len(b), nil
}

func infiniteStream() {
	reader.Validate(MyReader{})
}

//--- reader that emits infinite stream of 'A'-----
type MyPointerReader struct{}

func (r MyPointerReader) Read(b *[]byte) (int, error) {
	*b = append(*b, 65)
	//fmt.Printf("*b = %q\n", *b)
	return len(*b), nil
}

func infiniteStreamPtr() {
	r := MyPointerReader{}
	b := make([]byte, 0, 8)
	i := 0
	for {
		n, err := r.Read(&b)
		fmt.Printf("n = %v err = %v b = %v\n", n, err, b[:n])
		fmt.Printf("b[:n] = %q\n", b[:n])
		i++
		if i > 50 {
			break
		}
	}
}

// --- reading bytes from a string --------
func readString() {
	r := strings.NewReader("Hello, Reader!")
	b := make([]byte, 8)
	for {
		n, err := r.Read(b)
		fmt.Printf("n = %v err = %v b = %v\n", n, err, b[:n])
		fmt.Printf("b[:n] = %q\n", b[:n])
		//%q	a single-quoted character literal safely escaped with Go syntax.
		if err == io.EOF {
			break
		}
	}
}

// -----------------

//--- refactor Sqrt to handle complex numbers
type ErrNegativeSqrt float64

func (e ErrNegativeSqrt) Error() string {
	return fmt.Sprintf("Cannot sqrt negative number:  %f", float64(e))
}

func Sqrt2(x int) (float64, error) {
	delta := float64(x)
	z := float64(1)
	//z := float64(x)
	//z := float64(x / 2)
	if x < 0 {
		return z, ErrNegativeSqrt(x)
	} else {
		iterations := 1
		for ; math.Abs(delta) > 0.001; iterations++ {
			delta = ((z * z) - float64(x)) / (2 * z)
			z = z - delta
		}
		return z, nil
	}

}

func testSqrt2() {
	i := 56
	sqrt, e := Sqrt2(i)
	if e != nil {
		fmt.Println(e.Error())
	} else {
		fmt.Printf("Sqrt of %d is %f", i, sqrt)
	}
}

//----------------

//--- Simple Custom Error handling
type MyError struct {
	When time.Time
	What string
}

func (e *MyError) Error() string {
	return fmt.Sprintf("at %v, %s", e.When, e.What)
}

func run() error {
	return &MyError{
		time.Now(), "it didn't work",
	}
}

func testSimpleError() {
	if err := run(); err != nil {
		fmt.Println(err)
	}
}

//-----------------

//--- Stringify sample
type IPAddr [4]byte

func (ip IPAddr) String() string {
	return fmt.Sprintf("%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3])
}

func testIPAddress() {
	hosts := map[string]IPAddr{
		"loopback":  {127, 0, 0, 1},
		"googleDNS": {8, 8, 8, 8},
	}
	for name, ip := range hosts {
		fmt.Printf("%v: %v\n", name, ip)
	}
}

//---------------------

//---Understanding Interfaces
type Abser interface {
	Abs() float64
}

type MyFloat float64

func (f MyFloat) Abs() float64 {
	if f < 0 {
		return float64(-f)
	}
	return float64(f)
}

type Vertex struct {
	X, Y float64
}

func (v *Vertex) Abs() float64 {
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func testInterface() {
	var a Abser
	f := MyFloat(-math.Sqrt2)
	a = f
	fmt.Println(a.Abs()) //1.41421...

	v := Vertex{3, 4}
	a = &v
	//a = v will give error. (*Vertex implements Abs, not Vertex)
	fmt.Println(a.Abs()) //5

}

//----------------

//--- Closure Sample ----
func fibonacci() func() int {
	j := 0
	k := 1
	idx := 0
	return func() int {
		next := 0
		if idx == 0 {
			next = j
		} else if idx == 1 {
			next = k
		} else {
			next = j + k
			j = k
			k = next
		}
		idx++
		return next
	}
}

func testFibonacci() {
	f := fibonacci()
	for i := 0; i < 10; i++ {
		fmt.Println(f())
	}
}

// Closure func returns a function that updates the var
// declared in adder()
func adder() func(int) int {
	sum := 0
	return func(x int) int {
		sum += x
		return sum
	}
}

func testClosure() {
	pos, neg := adder(), adder()
	for i := 0; i < 10; i++ {
		fmt.Println(pos(i), neg(-2*i))

	}
}

func WordCount(s string) map[string]int {
	words := strings.Fields(s)
	wc_map := make(map[string]int)
	for _, word := range words {
		wc_map[word] = wc_map[word] + 1
	}
	return wc_map
}

func Pic(dx, dy int) [][]uint8 {
	pics := make([][]uint8, dy)
	for y := range pics {
		pics[y] = make([]uint8, dx)
		for x := range pics[y] {
			//pics[y][x] = uint8((x + y) / 2)
			//pics[y][x] = uint8(x*y)
			pics[y][x] = uint8(x ^ y)
		}
	}
	return pics
}

func Sqrt(x int) (float64, int) {
	delta := float64(x)
	z := float64(1)
	//z := float64(x)
	//z := float64(x / 2)

	iterations := 1
	for ; math.Abs(delta) > 0.001; iterations++ {
		delta = ((z * z) - float64(x)) / (2 * z)
		z = z - delta
	}
	return z, iterations
}

func Pow2(n int) []int {
	pow := make([]int, n)
	for i := range pow {
		pow[i] = 1 << uint(i) // == 2**i
	}
	return pow
}

func testSqrt() {
	z, i := Sqrt(34)
	fmt.Printf("closest square-root %f, iterations %d\n", z, i)
	fmt.Printf("using math.Sqrt %f\n", math.Sqrt(34))
}

func testPow2() {
	p := Pow2(10)
	for _, v := range p {
		fmt.Printf("%d\n", v)
	}
}

func testPic() {
	pic.Show(Pic)
}

func testWordCount() {
	wc.Test(WordCount)

}

func runPig() {
	strategies := make([]strategy, win)
	for k := range strategies {
		strategies[k] = stayAtK(k + 1)
	}
	wins, games := roundRobin(strategies)

	for k := range strategies {
		fmt.Printf("Wins, losses staying at k =% 4d: %s\n",
			k+1, ratioString(wins[k], games-wins[k]))
	}

}

func main() {
	//testSqrt()
	//testPow2()
	//testPic()
	//testWordCount()
	//testClosure()
	//testFibonacci()
	//testInterface()
	//testIPAddress()
	//testSimpleError()
	//testSqrt2()
	//readString()
	//infiniteStreamPtr()
	//infiniteStream()
	//dummyfunction()
	//testRot13Reader()
	//testMyImage()
	//testGoroutine()
	//testFibonacci2()
	//testFibonacci2()
	//tickToBoom()
	//testWalk()
	//testSafeCounter()
	//testWebCrawler()
	//channelAsFirstClassValue()
	//channelAsHandleOnService()
	//channelMultiplexing()
	//channelMultiplexingOrdered()
	runPig()

}
