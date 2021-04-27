package main

import (
	"fmt"
	"math"
	_ "math"
)

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

func main() {
	z, i := Sqrt(34)
	fmt.Printf("closest square-root %f, iterations %d\n", z, i)
	fmt.Printf("using math.Sqrt %f\n", math.Sqrt(34))
}
