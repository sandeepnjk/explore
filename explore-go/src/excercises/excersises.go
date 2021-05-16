package main

import "golang.org/x/tour/pic"

import (
	"fmt"
	"math"
	"strings"
	"golang.org/x/tour/wc"
)

func fibonacci() func() int {
  j := 0
  k := 1
  idx := 0
  return func() int {
    next := 0
    if ( idx == 0 ) { 
      next = j
    } else if ( idx == 1 ) {
      next = k
    } else {
      next = j + k
      j =  k
      k = next
    }
    idx++
    return next
  }
}

func testFibonacci() {
  f := fibonacci()
  for i := 0; i < 10; i ++ {
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
	infiniteStream()
}
