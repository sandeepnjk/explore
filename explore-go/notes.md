# Installation
- [Tutorial Ref:](https://golang.org/doc/tutorial/getting-started)
- [Download from golang.org](https://golang.org/dl/)
- [Visual Code Plugin](https://marketplace.visualstudio.com/items?itemName=golang.go)
  -   Code > Preferences > Extensions > Go 0.24.1
  - After install, VS  Code will ask to install tools, install all
   - (VS Studio Code extensions Commands)[https://github.com/golang/vscode-go/blob/master/docs/commands.md#commands]

# Hello World Program
- ```shell script
  cd ~/sn-workspace/explore/explore-go
  mkdir hello
  cd hello
  ```
- Enabling dependency tracking
  - importing packages contained in other modules
  - Enable dependency tracking by creating a `go.mod` file
    - ```shell script
      go mod init example.com/hello
      ```
      ```text
      go: creating new go.mod: module example.com/hello  
      ```
  - sample program
    - ```go
      package main
    
      import "fmt"
    
      func main() {
	    fmt.Println("Hello World!")
      }
      ```
    - `import "fmt"` is a standard text format package, including printing to console.
  - to run `go run .`
  - `go help`

## Importing packages from published modules
- [Search for packages in pkg.go.dev](https://pkg.go.dev/)
- adding 'rsc.io/quote' package `import "rec.io/quote"` and run `go mod tidy`
    - ```go
      package main
      import (
	    "fmt"
        "rsc.io/quote"
      )
      func main() {
	    fmt.Println(quote.Go())
      }
      ```
    - ```shell script
      go mod tidy
      go: finding module for package rsc.io/quote
      go: found rsc.io/quote in rsc.io/quote v1.5.2
      ```
    - Run `go mod tidy`, to locate and download the rsc.io/quote module that contains the package you imported. By default, it downloads the latest version  
    - ```shell script
      go run .
      Don't communicate by sharing memory, share memory by communicating.
      ```
- Create a module example.com/greetings
  - `go mod init example.com/greetings`
  - ```go
      package greetings
      import (
	      "fmt"
      )

      func Hello(name string) string {
	      message := fmt.Sprintf("Hi, %v. Welcome!", name)
	      return message
      }
    ```
  - import the `example.com/greetings` in `hello.go`
    - ```go
        package main

        import (
          "example.com/greetings"
          "fmt"
          //"rsc.io/quote"
        )

      func main() {
	      //fmt.Println(quote.Go())
	      message := greetings.Hello("Rambo")
	      fmt.Println(message)
      }
      ```
    - `example.com/greetings` is not in _pkg.go.dev_ but local. we need to fix this
      - `go mod edit -replace=example.com/greetings=../greetings`
        - a replace directive is added in `go.mod`
      - ```mod
        module example.com/hello

        go 1.16

        replace example.com/greetings => ../greetings
        ```
      - synchronize the dependencies in the hello module using ...
        - ```shell script
          go mod tidy
          go: found example.com/greetings in example.com/greetings v0.0.0-00010101000000-000000000000
          ```
      - updated `go.mod` file 
        - `go mod tidy` find the local code in the greetings directory
        - then adds a requires directive to specify _example.com/hello requires example.com/greetings_
        - a _pseudo_version_number_ is generated and tagged in the end to the requires directive
        - ```go
          module example.com/hello

          go 1.16

          require example.com/greetings v0.0.0-00010101000000-000000000000

          replace example.com/greetings => ../greetings
          ```
    - ```shell script
      cd hello
      go run .
      Hi, Rambo. Welcome!
      ```
- Issue encountered in VS Studio Code
  - imports were getting deleted on save.
  - issue: on save format code happens and since its no able to resolve the import it gets deleted. (think is a VS Code bug)
  - Hack:Code > Preferences > Settings > extensions > go > search "codeActionsOnSave" > edit in settings.json
    - ```json
      {
	      "folders": [
		      {
			      "path": "explore-go"
		      }
	      ],
	      "settings": {
		      "go.formatTool": "gofmt",
		      "[go]": {
			      "editor.insertSpaces": false,
			      "editor.formatOnSave": true,
			      "editor.codeActionsOnSave": {
				      "source.organizeImports": false
			      }
		      }
	      }
      }
      ```
  - ref: https://stackoverflow.com/questions/48124565/why-does-vscode-delete-golang-source-on-save

## Return and Handle Error
- [multiple __return__ values](https://golang.org/doc/effective_go#multiple-returns)
- return error in _greetings.go_ 
  ```go
  package greetings

  import (
    "errors"
    "fmt"
  )

  func Hello(name string) (string, error) {
    if name == "" {
      return "", errors.New("empty name")
    }
    message := fmt.Sprintf("Hi, %v. Welcome!", name)
    return message, nil
  }
  ```
- handle error in _hello.go_, using _log_ package 
  ```go
  package main

  import (
    "example.com/greetings"
    "fmt"
    "log"
    //"rsc.io/quote"
  )

  func main() {
    //fmt.Println(quote.Go())
    log.SetPrefix("greetings: ")
    //log.SetFlags(0)
    message, err := greetings.Hello("")

    if err != nil {
      log.Fatal(err)
    }
    fmt.Println(message)
  }
  ```

## Go _slice_ type
- [Slice Intro](https://blog.golang.org/slices-intro)
- Slice is analogous to Array, but have unusual properties
  - A slice contains a pointer, length, capacity
  - The pointer points to a underlying Array
- Creating a slice, similar to array, but no specified length
  ```go
  //creating array
  a := [2]string{"Captain", "Haddock"}

  //creating slice
  letters := []string{"a","b","c","d"}

  //creating slice usning built-in function 'make'
  //func make([]T, len, cap) []T
  var s []byte
  s = make([]byte, 5, 5)
  //s == []byte{0, 0, 0, 0, 0}
  //more succintly, s = make([]byte, 5)
  ```
  - if _capacity_ arg is omitted it defaults to the specified length.
- Slice Internals
  - ![Slice Structure](./notes-images/slice-struct.png)
  - `s = make([]byte, 5)`
    ![Slice Internal](./notes-images/slice-1.png)
  - Slicing does not the slice's data, new slice that points to original array
    - `s = s[2:4]`
      ![Slicing Internal](./notes-images/slice-2.png)
      ```go
      d := []byte{'r', 'o', 'a', 'd'}
      e := d[2:]
      // e == []byte{'a', 'd'}
      e[1] = 'm'
      // e == []byte{'a', 'm'}
      // d == []byte{'r', 'o', 'a', 'm'}
      ```
  - Grow the slice capacity
    - using `func copy(dst, src, []T) int`
      ```go
      var s []byte
      s = make([]byte, 5, 5)
      s = s[2:4]

      //double the capacity of s
      t := make([]byte, len(s), (cap(s)+1)*2)
      copy(t, s)
      s = t
      ```

## Using `map`
- return and store the random message for a list of names
  ```go
  func Hellos(names []string) (map[string]string, error) {
    messages := make(map[string]string)
    for _, name := range names {
      message, err := Hello(name)
      if err != nil {
        return nil, err
      }
      messages[name] = message
    }
    return messages, nil
  }
  ```

## Adding Unit Test
- _go_'s built in support for unit testing.
- `import "testing"`
- add `greetings_test.go` in the same package
  ```go
  package greetings

  import (
    "regexp"
    "testing"
  )

  func TestHelloName(t *testing.T) {
    name := "foobar"
    want := regexp.MustCompile(`\b` + name + `\b`)
    msg, err := Hello("foobar")
    if !want.MatchString(msg) || err != nil {
      t.Fatalf(`Hello("foobar") = %q, %v, want match for %#q, nil`, msg, err, want)
    }
  }

  func TestHelloEmpty(t *testing.T) {
    msg, err := Hello("")
    if msg != "" || err == nil {
      t.Fatalf(`Hello("") = %q, %v, want "", error`, msg, err)
    }
  }
  ```
  ```go
  go test
  PASS
  ok  	example.com/greetings	0.504s 
  ```
  ```go
  go test -v
  === RUN   TestHelloName
  --- PASS: TestHelloName (0.00s)
  === RUN   TestHelloEmpty
  --- PASS: TestHelloEmpty (0.00s)
  PASS
  ok  	example.com/greetings	0.236s
  ```

## Compile and Install the application
- `go build`   builds the executable based on the OS.
- discover the go install path
  ```shell script
  go list -f '{{.Target}}'
  /Users/sandeep_nanajkar/go/bin/hello
  ```
- `go install`  by default installs to the path `go list -f '{{.Target}}'`
- will need to export this path in the PATH variable to execute the 'hello' program from any directory.
  `export PATH=$PATH:/Users/sandeep_nanajkar/go/bin/hello`
- To install to a required path say $HOME/tmp/bin, declare a go env variable `GOBIN`.
  `go env -w GOBIN=/Users/sandeep_nanajkar/tmp/bin`. note: This path needs to be included in the __PATH__ environment variable.
  ```shell script
  mkdir ~/tmp/bin
  go env -w GOBIN=/Users/sandeep_nanajkar/tmp/bin
  go install
  ls ~/tmp/bin/
  hello
  ```

# Tour of Go

## Intro Go Play Ground
- [Tour of Go](https://tour.golang.org/welcome/1)
- offline version Run `go get golang.org/x/tour` this will install `tour` binary in the workspace bin directory.
- Running `tour`  will open up the browser with the tour application
  - 'tour' is built atop the `Go Playground` webservice that runs on _glang.org's_ servers
  - Go Playground is a sandbox with limitations
  - date (time begins at 2009-11-10 23:00:00 UTC) - makes it easier to cache programs, deterministc output?? //todo: later

##  Basics

### Packages - every Go program is made up of packages.
- Program start running in package `main`
- By convention, the package name is the same as the last element of the import path
  - For instance, the "math/rand" package comprises files that begin with the statement package rand.

### Imports
  - [GforG: Imports](https://www.geeksforgeeks.org/import-in-golang/)
  - Best Practice: generally short and simple without '_' and '-'
    ```go
    package main
    import (
      "fmt"
      "math"
    )
    func main() {
      c := math.Exp2(5)
      f.Println(c)
    }
    ```
  - Nested Import. eg. `import "math/rand"`
    - importing a sub-package from a larger package file.
    - why? reduce the memory size for the source code.
    ```go
    package main  
    import (
      "fmt"
      "math/rand"
    )
    func main() {
      fmt.Println(rand.Int(100))
    }
    ```
  - Aliased imports are also supported.
    ```go
    import m "math"
    import f "fmt"
    ```
    ```go
    package main
    import (
      f "fmt"
      m "math"
    )
    func main() {
      c := m.Exp2(5)    
      f.Println(c)                
    }
    ```
  - Dot Import
    - rarely used. generally by testers. convinience.
    - drawback - can cause namespace conflict.
    ```go
    package main
    import (
      "fmt"
      . "math"
    )
    func main() {
      f.Println(Exp2(5))                
    }
    ```
  - Blank Import
    - goLang does not allow a import that's not going to be used. gives errors.
    - sometimes we need to package to act a a blueprint to be used later.
    - we can use the blank import by placing a blank in the import. `import _ "math"`
      ```go
      package main
      import (
        "fmt"
        "math/rand"
      )
      func main() {
        fmt.Println("Hello Geeks")
      }
      //The program looks correct but compiler will throw error on building the code.
      ```
      ```go
      package main
      import (
        "fmt"
        _ "math/rand"
      )
      func main() {
        fmt.Println("Hello Geeks")
      }
      //Compiler will not throw error on building the code.
      ```
  - Relative Imports
    - say our packages are in local or on cloud directory
    - we cannot directly import the package with its name unless its in the _$GOPATH_
      - lets say our packages is in _github.com_ in repo _gopherguides_ in package _greet    _ `import "github.com/gopherguides/greet"`
      ```go
      package main   
      import "github.com/gopherguides/greet"
      func main() {
        greet.Hello()
      }
      ```
    - Circular Imports not supportrd by Go. will throw Compiler error.

### Exported Names
- In Go, a name is exported if it begins with a capital letter.
- When importing a package, you can refer only to its exported names.
- Any "unexported" names (i.e non-capitalized) are not accessible from outside the package.
- `math.pi` is invalid, `math.Pi` is valid
  ```go
  package main
  import (
    "fmt"
    "math"
   )
  func main() {
    //fmt.Println(math.pi) //error: cannot refer to unexported name math.pi
    fmt.Println(math.Pi) //correct
  }
  ```

### functions
- can take 0 or more args
- type comes after variable name
- [Go's Declaration Syntax](https://blog.golang.org/declaration-syntax)
  ```go
  func add(x int, y int) int {
	return x + y
  }
  ```
- if 2 or more consicutive args in a fung share the same type, you can omit type  from all except last.
  ```go
  func add(x, y int) int {
        return x + y
  }
  ```
- function can return any number of results.
  ```go
  func swap(x, y string) (string, string) {
	return y, x
  }
  ```
- Named return values
  - Return values may be named.
  - They are treated as variables defined at the top of the function.
  - return statement without arguments returns the named returns values. This is    called the _Naked return_
    ```go
    func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return
    }
    ```
- Variables
  - declared using `var`, as in functions, type is last. `var i int`
  - can include initializers, one per variable
  - if initializers is present, type can be omitted. it will be inferred form the initializer.
    ```go
    package main
    import "fmt"
    var i, j int = 1, 2
    func main() {
      var c, python, java = true, false, "no!"
      fmt.Println(i, j, c, python, java)
    }
    ```     
- Short variable declaration
  - the `:=` is called the short assignment statement 
  - Can be done __only inside a function__
  - no need to use `var`
  - outside a function, every statement begins with a key word _(var, func, ...)
  - `:=` construct is not available outside a function.
- Go's basic types
  - `bool`,
  - `string`,
  - `int int8 int16 int32 int64`
  - `uint uint8 uint16 uint32 uint64 uintptr`
  - `int`/`uint` will be `int32`/`uint32` or `int64`/`uint64` based on the OS
  - `byte`  alias for `uint8`
  - `rune` alias for `uint32` represents a unicode code point. ??
  - `float32` `float64`
  - `complex64` `complex128`
  - variables declared without explicit initialization
    - 0 for numeric types
    - false for boolean type
    - `""` for strings
  - Type conversions
    - `T(v)`   converts `v` to type `T`
      ```go
      i := 34
      f := float64(i)
      u := uint(f)
      ```
    - unlike 'c' 'go' requires explicit conversion
      ```go
      var f float64 = 2.43
      var z uint = f //error: cannot use f (type float64) as type uint in assignment
      ```
  - Type inference
    - declaring a variable without a explicit type, the type is inferred from the value on the right.
    - when the right hand value is itself untyped numeric constant, the type assigned (int, float64, or complex128) will depend on the pression.
  - Constants
    - `const` keyword
    - `const` cannot be declared using `:=` syntax
  - Numeric Constants
    - high precision values
    - untyped constant takes the type needed by its contest
    - an int can store at max 64-bit integers, sometimes less
    ```go
    package main
    import "fmt"
    const (
      Big = 1 << 100
      Small = Big >> 99
    )
    func needInt(x int) int { return x*10 + 1 }
    func needFloat(x float64) float64 {
      return x * 0.1
    }
    func main() {
      fmt.Println(needInt(Small))
      fmt.Println(needFloat(Small))
      fmt.Println(needFloat(Big))
    }
    ```
- Control Structures
 - `for [init]; condition; [post]` Note: init and post are optional 
 - `for i := 0; i < 10; i++ {}` Note: no brackets unlike c, java, js
 - `for ; sum < 1000; {}`
 - There is no separate while. `for sum < 1000 {}` is while
 - forever `for {}`
 - `if x < 0 {}`  Expression parenthesis not required, braces for the if body needed
 - if with short statement. The if statement can start with a short statement to execute before the condition.
   - `if v := math.Pow(x, n); v < lim {)`
   - variable declared within if, are limited to the scope within the if.
 - variables declared within a if are available to any of the else block
   ```go
   if v := math.Pow(x, n); v < lim {
     return v
   } else {
     fmt.Printf("%g >= %g\n", v, lim)
   }
   ```
   - [Ex: find closest square-root for a number](https://github.com/sandeepnjk/explore/blob/master/explore-go/excercises/excersises.go)
 - Go switch cases, runs only the selected case. (i.e. break is implicit.)
     ```go
     switch os := runtime.GOOS; os {
       case "darwin":
         fmt.Println("OS X.")
       case "linux":
         fmt.Println("Linux.")
       default:
	 fmt.Printf("%s.\n", os)
     }
     ```
   - cases need not be constant and values need not be integers
   - Switch with no conditions (i.e switch true)
     '''go
     func main() {
       t := time.Now()
       switch {
         case t.Hour() < 12:
	   fmt.Println("Good morning!")
	case t.Hour() < 17:
	  fmt.Println("Good afternoon.")
	default:
	  fmt.Println("Good evening.")
       }
     }
     '''
 - `Defer` keyword. A defer statement defers the execution of a function until the surrounding function returns.
    ```go
    package main
    import "fmt"
    func main() {
      defer fmt.Println("world")
      fmt.Println("hello")
      //hello followed by world
    }
    ```
    - Deferred functions calls pushed onto the stack, LIFO

### Pointers
- Go has pointers
- type `*T` is a pointer to T value
- `&` operator generates a pointer to its operand
- ```go
  i, j := 42, 2701
  p := &i
  
  fmt.Println(*p) //42
  *p = 21
  fmt.Println(i) //21
  
  p = &j
  *p = *p / 37    // 2701 / 37
  fmt.Println(*p) //73
  ```

### Structs
- collection of fields
- fields accessed using .
- Pointers to Struct, The special prefix & returns a pointer to the struct value.
- ```go
  package main
  
  import "fmt"
  
  type Vertex struct {
    X int
      Y int
  }
  
  func main() {
    v := Vertex{1, 2}
    fmt.Println(v) //{1 2}
    v.X = 4
    fmt.Println(v.X) //4
    
    p := &v
    p.X = 345
    fmt.Println() //{345 2}
    
    var (
      v1 = Vertex{1, 2}  // has type Vertex
      v2 = Vertex{X: 1}  // Y:0 is implicit
      v3 = Vertex{}      // X:0 and Y:0
      p  = &Vertex{1, 2} // has type *Vertex
      fmt.Println(v1, p, v2, v3) //{1 2} &{1 2} {1 0} {0 0}
      fmt.Println(v1, *p, v2, v3) //{1 2} {1 2} {1 0} {0 0}
    )
  }
  ```

### Arrays
- The type `[n]T` is an array of `n` values of type `T`
- `var a [10]int` Length of an array is a part of its type
- cannot be resized
- ```go
    package main

    import "fmt"

    func main() {
      var a [2]string
      a[0] = "Hello"
      a[1] = "World"
      fmt.Println(a[0], a[1]) // Hello World
      fmt.Println(a) //[Hello World]
      
      primes := [6]int{2, 3, 5, 7, 11, 13}
      fmt.Println(primes) //[2 3 5 7 11 13]
    }
  ```

### Slices
- [Details](#go-slice-type)
- `[]T` is a slice with elements of Type `T`
- ```go
    package main

    import "fmt"

    func main() {
      primes := [6]int{2, 3, 5, 7, 11, 13}
      var s []int = primes[1:4]
      fmt.Println(s) [3 5 7]
    }
    ```
- slice does not store data, refers to the underlying array
- changes to the elements in the slice are actually on the underlying array
- other slices that reference the same array, will see those changes
- ```go
    package main
    
    import "fmt"
    
    func main() {
      names := [4]string{
        "John",
        "Paul",
        "George",
        "Ringo",
      }
      fmt.Println(names)
      
      a := names[0:2]
      b := names[1:3]
      fmt.Println(a, b) //slice [John Paul] [Paul George]
      
      b[0] = "XXX"
      fmt.Println(a, b) //slice [John XXX] [XXX George]
      fmt.Println(names) [John XXX George Ringo]
    }
    ```
- slice literals
  - ```go
    package main
    import "fmt"
    func main() {
      q := []int{2, 3, 5, 7, 11, 13}
      fmt.Println(q)
      
      r := []bool{true, false, true, true, false, true}
      fmt.Println(r)
      
      s := []struct {
        i int
        b bool
      }{
        {2, true},
        {3, false},
        {5, true},
        {7, true},
        {11, false},
        {13, true},
      }
      fmt.Println(s)
    }
    ```
  - when slicing, high or low bounds can be omitted to use defaults
    - ```go
      a := [10]int
      
      s = a[0:10]
      s1 = a[:10]
      s2 = a[0:]
      s3 = a[:]
      //all are equivalent
      ```
  - length and capacity of a slice - `len(s)`, `cap(s)`
    - a slice can be extended, but cannot be extended beyond the slice capacity
    - ```go
      package main
      import "fmt"
      
      func main() {
        s := []int{2, 3, 5, 7, 11, 13}
        printSlice(s) //len=6 cap=6 [2 3 5 7 11 13]

        // Slice the slice to give it zero length.
        s = s[:0]
        printSlice(s) //len=0 cap=6 []
        
        // Extend its length.
        s = s[:4]
        printSlice(s) //len=4 cap=6 [2 3 5 7]
        
        // Drop its first two values.
        s = s[2:]
        printSlice(s) //len=2 cap=4 [5 7]
        
        s = s[:7] //panic: runtime error: slice bounds out of range [:7] with capacity 4
      }

      func printSlice(s []int) {
        fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
      }
      ```
  - Nil Slices, length and capacity are 0. `s := []int`
    - ```go
      package main
      import "fmt"
      func main() {
        var s []int
        fmt.Println(s, len(s), cap(s)) //[] 0 0
        if s == nil {
                fmt.Println("nil!")
        }
      }
      ```
  - Creating a slice with make
    - `a := make([]int, 5)  // len(a)=5`
    - `b := make([]int, 0, 5) // len(b)=0, cap(b)=5`
  - slice can contain any type including other slices.
  - appending to slice
    - slice grows as is needed, underlying array is changed
    - ```go
      package main
      import "fmt"
      func main() {
        var s []int
        printSlice(s) //len=0 cap=0 []

        // append works on nil slices.
        s = append(s, 0)
        printSlice(s) //len=1 cap=1 [0] 

        // The slice grows as needed.
        s = append(s, 1)
        printSlice(s) //len=2 cap=2 [0 1]

        // We can add more than one element at a time.
        s = append(s, 2, 3, 4)
        printSlice(s) //len=5 cap=6 [0 1 2 3 4] //something funny here, cap is not 5 but 6, looks like append uses some logic
	//https://github.com/golang/go/blob/87e48c5afdcf5e01bb2b7f51b7643e8901f4b7f9/src/runtime/slice.go#L100-L112
      }
      func printSlice(s []int) {
        fmt.Printf("len=%d cap=%d %v\n", len(s), cap(s), s)
      }
      ```
    - [slice append logic](https://github.com/golang/go/blob/87e48c5afdcf5e01bb2b7f51b7643e8901f4b7f9/src/runtime/slice.go#L100-L112)
- Range
  - `range` form of the `for` loop iterates over a slice or map.
  - 2 values are returned _index_, _copy of the element at that index_
- can skip the return value by assigning to `_` either of return values by `range`
    - `for i, _ := range pow`
    - `for _, value := range pow`
  - if only index is required
    - `for i := range pow`
  - ```go
    package main
    import "fmt"
    func main() {
      pow := []int{1, 2, 4, 8, 16, 32, 64, 128}
      for i, v := range pow {
        mt.Printf("2**%d = %d\n", i, v)
      }
    }
    ```
- [Excercise:Slices](#ex-slice-1)

### Maps
- `nil` map. (i.e. zero value map)
- `nil` map has no keys, and new keys cannot be added. (??)
- `make(map[String]Vertex)` function used to return a map of the given type, initialized.
- ```go
  package main
  import "fmt"
  
  type Vertex struct {
    Lat, Long float64
  }
  var m map[string]Vertex
  func main() {
    m = make(map[string]Vertex)
    m["Bell Labs"] = Vertex{40.68433, -74.39967,}
    fmt.Println(m["Bell Labs"]) //{40.68433 -74.39967}
  }
  ```
- map Literals similar to struct literals. Top level Type name can be omitted
  -  ```go
	 var m = map[string]Vertex{
	   "Bell Labs": Vertex{40.68433, -74.39967,},
	   "Google": Vertex{37.42202, -122.08408,},
     }
	 ```
	 ```go
	  var m = map[string]Vertex{
	    "Bell Labs":{40.68433, -74.39967},
	     "Google": Vertex{37.42202, -122.08408},
      }
	  ```
- Mutating maps
  - insert/update, `m[key] = value`
  - retrieve, `elem = m[key]`
  - delete, `delete(m, key)`
  - check for key, `elem, ok :=  m[key]`
	- key present, `ok` is `true` else `false`
	- if key not present, elem is `nil`
  - ```go
	package main
    import "fmt"
        
    func main() {
	  m := make(map[string]int)
      	  	
	  m["Answer"] = 42
	  fmt.Println("The value:", m["Answer"]) //The value: 42
        
	  m["Answer"] = 48
	  fmt.Println("The value:", m["Answer"]) //The value: 48
      
	  delete(m, "Answer")
	  fmt.Println("The value:", m["Answer"])//The value: 0
        
	  v, ok := m["Answer"]
	  fmt.Println("The value:", v, "Present?", ok) //The value: 0 Present? false
    }
	```
  - [Excercise: Maps](#excercise-maps-1)

### Functions
- Functions are values too
- Function values used as function arguments and return values
- ```go
  package main
  
  import (
    "fmt"
    "math"
  )
  
  func compute(fn func(float64, float64) float64) float64 {
    return fn(3, 4)
  }
  
  func main() {
    hypot := func(x, y float64) float64 {
        return math.Sqrt(x*x + y*y)
    }
    fmt.Println(hypot(5, 12)) //13
    
    fmt.Println(compute(hypot))  //5
    fmt.Println(compute(math.Pow)) //81
  }
  ```
- Function Closures
  - A closure is a function value that references variables from outside its body.
  - The function may access and assign to the referenced variables
  - ```go
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
    ```
  - (Excercise: Closure)[#ex-closure-1]

### Methods
- No classes in GoLang
- Methods can be defined on types
- Method is a function with a receiver adgument
- ```go
  package main
  
  import (
    "fmt"
	"math"
  )

  type Vertex struct {
	X, Y float64
  }

func (v Vertex) Abs() float64 {
  - (Excercise: Closure)[#ex-closure-1]u
	return math.Sqrt(v.X*v.X + v.Y*v.Y)
}

func main() {
	v := Vertex{3, 4}
	fmt.Println(v.Abs())
}
  ```



# Questions and Excercises

### ex-range-1
- Print the powers of 2 (i.e 2**i) for i=0 to 10.
  - Hints: shift the bits of 1 by N
  - Hints: use range
  - ```go
    package main
    import "fmt"
    func main() {
      pow := make([]int, 10)
      for i := range pow {
        pow[i] = 1 << uint(i) // == 2**i
      }
      for _, value := range pow {
        fmt.Printf("%d\n", value)
      }
    }
    ```
  - Given a sorted array of unique integers, write a method that takes this array and returns an array of ranges of contiguous values. Each range is an array with the start and end integers (inclusive) of the contiguous portions of the original array
    - ```go
	  Input: [2, 3, 6, 7, 8, 9, 14, 15, 16, 17]
	  Output: [[2, 3], [6, 9], [14, 17]]
	  Input: [8, 9]
	  Output: [[8, 9]]
	  ```

### ex-slice-1
- Implement Pic. It should return a slice of length dy, each element of which is a slice of dx 8-bit unsigned integers. When you run the program, it will display your picture, interpreting the integers as grayscale (well, bluescale) values.
  - The choice of image is up to you. Interesting functions include (x+y)/2, x*y, and x^y.
  - (You need to use a loop to allocate each []uint8 inside the [][]uint8.)
  - (Use uint8(intValue) to convert between types.)
  - ```go
      package main
      import "golang.org/x/tour/pic"
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
      func testPic() {
        pic.Show(Pic)
      }
      func main() {
        testPic()
      }
  ```

### ex-maps-1
- Implement WordCount. It should return a map of the counts of each “word” in the string s. The wc.Test function runs a test suite against the provided function and prints success or failure._You might find strings.Fields helpful._
- ```go
  package main
  
  import "golang.org/x/tour/pic"
  
  import (
    "strings"
    "golang.org/x/tour/wc"
  )
  
  func WordCount(s string) map[string]int {
    words := strings.Fields(s)
    wc_map := make(map[string]int)
    for _, word := range words {
        wc_map[word] = wc_map[word] + 1 
    }
    return wc_map
  }
  
  func main() {
    testWordCount()
  }
  ```

### ex-closure-1
- Implement a fibonacci function that returns a function (a closure) that returns successive fibonacci numbers (0, 1, 1, 2, 3, 5, ...).
  - ```go
	package main
	import "fmt"
	
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
    ```
