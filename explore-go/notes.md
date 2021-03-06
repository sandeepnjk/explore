# Installation
- [Tutorial Ref:](https://golang.org/doc/tutorial/getting-started)
- [Download from golang.org](https://golang.org/dl/)
- [Visual Code Plugin](https://marketplace.visualstudio.com/items?itemName=golang.go)
  -   Code > Preferences > Extensions > Go 0.24.1
  - After install, VS  Code will ask to install tools, install all
   - (VS Studio Code extensions Commands)[https://github.com/golang/vscode-go/blob/master/docs/commands.md#commands]

# Quick Ref Links
- [fmt format verbs](https://golang.org/pkg/fmt/)
- [Go Documentation](https://golang.org/doc/)
- [Organize and Work with Go-screencast](https://www.youtube.com/watch?v=XCsL89YtqCs)
- [Organize and Work with Go](https://golang.org/doc/code)
- [Standard Library - Package Reference](https://golang.org/pkg/)
- [Go Language Spec](https://golang.org/ref/spec)
- [Go Concurrency Patterns](https://www.youtube.com/watch?v=f6kdp27TYZs)

# Hello World Program
## Setting up the code
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
    - ```text
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
      - ```
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
        - ```
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
  ok    example.com/greetings   0.504s 
```
```go
  go test -v
  === RUN   TestHelloName
  --- PASS: TestHelloName (0.00s)
  === RUN   TestHelloEmpty
  --- PASS: TestHelloEmpty (0.00s)
  PASS
  ok    example.com/greetings   0.236s
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

### Variables
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
```go
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

```go
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

#### Type Embedding (anonymous fields) ####
- a _struct_ can be composed of a field type only. (i.e no explicit variable names)
- The unqualified type name of an embedded field acts as the name of the field.

``` go
package main

import "net/http"

func main() {
	type P = *bool
	type M = map[int]int
	var x struct {
		string // a defined non-pointer type
		error  // a defined interface type
		*int   // a non-defined pointer type
		P      // an alias of a non-defined pointer type
		M      // an alias of a non-defined type

		http.Header // a defined map type
	}
	x.string = "Go"
	x.error = nil
	x.int = new(int)
	x.P = new(bool)
	x.M = make(M)
	x.Header = http.Header{}
}
```

#### Types that can be embedded ####
  * A type name T can be embedded as an embedded field unless T denotes a defined pointer type or a pointer type which base type is either a pointer or an interface type.
  * A pointer type *T, where T is a type name denoting the base type of the pointer type, can be embedded as an embedded field unless type name T denotes a pointer or interface type.

``` go
  type Encoder interface {Encode([]byte) []byte}
  type Person struct {name string; age int}
  type Alias = struct {name string; age int}
  type AliasPtr = *struct {name string; age int}
  type IntPtr *int
  type AliasPP = *IntPtr
  
  // These types and aliases can be embedded.
  Encoder
  Person
  *Person
  Alias
  *Alias
  AliasPtr
  int
  *int
  
  // These types and aliases can't be embedded.
  AliasPP          // base type is a pointer type
  *Encoder         // base type is an interface type
  *AliasPtr        // base type is a pointer type
  IntPtr           // defined pointer type
  *IntPtr          // base type is a pointer type
  *chan int        // base type is a non-defined type
  struct {age int} // non-defined non-pointer type
  map[string]int   // non-defined non-pointer type
  []int64          // non-defined non-pointer type
  func()           // non-defined non-pointer type
```

#### Type Embedding and extending functionalaties ####
  * The main purpose of type embedding is to extend the functionalities of the embedded types into the embedding type
  * object-oriented programming languages use inheritance to achieve the same goal of type embedding
	* [Type Composition over Inheritance](https://en.wikipedia.org/wiki/Composition_over_inheritance "discusses benefits and drawbacks") (Composite reuse principle)
	* If a type T __inherits__ another type, then type T obtains the abilities of the other type. At the same time, each value of type T can also be viewed as a value of the other type.
	* If a type T __embeds__ another type, then type other type becomes a part of type T, and type T obtains the abilities of the other type, but none values of type T can be viewed as values of the other type.

``` go
package main

import "fmt"

type Person struct {
	Name string
	Age  int
}
func (p Person) PrintName() {
	fmt.Println("Name:", p.Name)
}
func (p *Person) SetAge(age int) {
	p.Age = age
}

type Singer struct {
	Person // extends Person by embedding it
	works  []string
}

func main() {
	var gaga = Singer{Person: Person{"Gaga", 30}}
	gaga.PrintName() // Name: Gaga
	gaga.Name = "Lady Gaga"
	(&gaga).SetAge(31)
	(&gaga).PrintName()   // Name: Lady Gaga
	fmt.Println(gaga.Age) // 31
}

/* Results
main.Singer has 2 fields:
 field#0: Person
 field#1: works
main.Singer has 1 methods:
 method#0: PrintName
*main.Singer has 2 methods:
 method#0: PrintName
 method#1: SetAge
*/
```

``` go

package main

import "fmt"

type Person struct {
	Name string
	Age  int
}
func (p Person) PrintName() {
	fmt.Println("Name:", p.Name)
}
func (p *Person) SetAge(age int) {
	p.Age = age
}

type Singer struct {
	Person // extends Person by embedding it
	works  []string
}

func main() {
	t := reflect.TypeOf(Singer{}) // the Singer type
	fmt.Println(t, "has", t.NumField(), "fields:")
	for i := 0; i < t.NumField(); i++ {
		fmt.Print(" field#", i, ": ", t.Field(i).Name, "\n")
	}
	fmt.Println(t, "has", t.NumMethod(), "methods:")
	for i := 0; i < t.NumMethod(); i++ {
		fmt.Print(" method#", i, ": ", t.Method(i).Name, "\n")
	}

	pt := reflect.TypeOf(&Singer{}) // the *Singer type
	fmt.Println(pt, "has", pt.NumMethod(), "methods:")
	for i := 0; i < pt.NumMethod(); i++ {
		fmt.Print(" method#", i, ": ", pt.Method(i).Name, "\n")
	}
}

/*
main.Singer has 2 fields:
 field#0: Person
 field#1: works
main.Singer has 1 methods:
 method#0: PrintName
*main.Singer has 2 methods:
 method#0: PrintName
 method#1: SetAge
*/
```

#### Shorthand of Selectors ####
  * A selector is an expression, which represents a value. `x.y`
  * In Go, (without considering selector colliding and shadowing explained in a later section), if a middle name in a selector corresponds to an embedded field, then that name can be omitted from the selector. 
  * This is why embedded fields are also called anonymous fields.

``` go
package main

type A struct {
	x int
}
func (a A) MethodA() {}

type B struct {
	A
}
type C struct {
	B
}

func main() {
	var c C
	pc = &c

	// The following 4 lines are equivalent.
	_ = c.B.A.x
	_ = c.B.x
	_ = c.A.x
	_ = c.x // x is called a promoted field of type C

	// The following 4 lines are equivalent.
	c.B.A.MethodA()
	c.B.MethodA()
	c.A.MethodA()
	c.MethodA()
	
	// The following 4 lines are equivalent.
	fmt.Println(pc.B.A.x)
	fmt.Println(pc.B.x)
	fmt.Println(pc.A.x)
	fmt.Println(pc.x)
	
	// The following 4 lines are equivalent.
	pc.B.A.MethodA()
	pc.B.MethodA()
	pc.A.MethodA()
	pc.MethodA()
	
}
```

#### Selector shadowing ####
  * only the full-form selector with the shallowest depth (assume it is the only one) can be shortened as x.y
  * if there are more than one full-form selectors with the shallowest depth, then none of those full-form selectors can be shortened as x.y. We say those full-form selectors with the shallowest depth are colliding with each other.

``` go
type A struct {
	x string
}
func (A) y(int) bool {
	return false
}

type B struct {
	y bool
}
func (B) x(string) {}

type C struct {
	B
}

var v1 struct {
	A
	B
}

func f1() {
	_ = v1.x // error: ambiguous selector v1.x (shallowest depth matches field v1.A.x  and method V1.B.x)
	_ = v1.y // error: ambiguous selector v1.y - v1.A.y (shallowest depth matches method v1.A.y and field v1.B.y)
}


var v2 struct {
	A
	C
}

func f2() {
	fmt.Printf("%T \n", v2.x) // string, (matches field v2.A.x and method v2.C.B.x but the shallowest is only V2.A.x)
	fmt.Printf("%T \n", v2.y) // func(int) bool, (matches method v2.A.y and field v2.C.B.y)
}
```
  

  

### Arrays ###
- The type `[n]T` is an array of `n` values of type `T`
- `var a [10]int` Length of an array is a part of its type
- cannot be resized
```go
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
- something

### Slices ###
- [Details](#go-slice-type)
- `[]T` is a slice with elements of Type `T`

```go
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

```go
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

```go
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

```go
      a := [10]int
      s = a[0:10]
      s1 = a[:10]
      s2 = a[0:]
      s3 = a[:]
      //all are equivalent
```
  - length and capacity of a slice - `len(s)`, `cap(s)`
    - a slice can be extended, but cannot be extended beyond the slice capacity

```go
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

```go
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

```go
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
        printSlice(s) //len=5 cap=6 [0 1 2 3 4] 
		//something funny here, cap is not 5 but 6, looks like append uses some logic
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

```go
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

```go
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

```go
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

```go
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

## Functions
- Functions are values too
- Function values used as function arguments and return values

```go
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
  - Function arguments are passed by value (unless it a pointer)
- Function Closures
  - A closure is a function value that references variables from outside its body.
  - The function may access and assign to the referenced variables

```go
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
  
### First class fnctions in Go ####
- Go supports first class functions, higher-order functions, user-defined function types, function literals, closures, and multiple return values.
- This rich feature set supports a functional programming style in a strongly typed language.

``` go pig.go
package main

import (
	"fmt"
	"math/rand"
)

const (
	win            = 100
	gamesPerSeries = 10
)

type score struct {
	player, opponent, thisTurn int
}

//action declared as a func type, that will return score and bool on being called.
type action func(current score) (result score, turnIsOver bool)

func roll(s score) (score, bool) {
	outcome := rand.Intn(6) + 1
	if outcome == 1 {
		return score{s.opponent, s.player, 0}, true
	}
	return score{s.player, s.opponent, outcome + s.thisTurn}, false
}

func stay(s score) (score, bool) {
	return score{s.opponent, s.player + s.thisTurn, 0}, true
}

//strategy as a func type which  which when called returns another function type i.e action
type strategy func(score) action

//function  that returns a function type (stay or roll)
func stayAtK(k int) strategy {
	return func(s score) action {
		if s.thisTurn >= k {
			return stay
		}
		return roll
	}
}

//func that takes func type args
func play(strategy0, strategy1 strategy) int {
	strategies := []strategy{strategy0, strategy1}
	var s score
	var turnIsOver bool
	currentPlayer := rand.Intn(2)
	for s.player+s.thisTurn < win {
		action := strategies[currentPlayer](s)
		s, turnIsOver = action(s)
		if turnIsOver {
			currentPlayer = (currentPlayer + 1) % 2
		}
	}
	return currentPlayer
}

func roundRobin(strategies []strategy) ([]int, int) {
	wins := make([]int, len(strategies))
	for i := 0; i < len(strategies); i++ {
		for j := i + 1; j < len(strategies); j++ {
			for k := 0; k < gamesPerSeries; k++ {
				winner := play(strategies[i], strategies[j])
				if winner == 0 {
					wins[i]++
				} else {
					wins[j]++
				}
			}
		}
	}
	gamesPerStrategy := gamesPerSeries * (len(strategies) - 1)
	return wins, gamesPerStrategy
}

func ratioString(vals ...int) string {
	total := 0
	for _, val := range vals {
		total += val
	}
	s := ""
	for _, val := range vals {
		if s != "" {
			s += ", "
		}

		pct := 100 * float64(val) / float64(total)
		s += fmt.Sprintf("%d/%d (%0.1f%%)", val, total, pct)
	}
	return s
}

func main() {
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

```

## Methods
- No classes in GoLang
- Methods can be defined on types
- Method is a function with a receiver argument `func (v Vertex) Abs() float64 {`
  - the `Abs` method has a receiver of type `Vertex` named `v`
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
    return math.Sqrt(v.X*v.X + v.Y*v.Y)
  }
  
  func main() {
    v := Vertex{3, 4}
    fmt.Println(v.Abs())
  }
  ```
- Can declare a method on non-struct types too.
  - ```go
    package main
    import (
      "fmt"
      "math"
    )
    type MyFloat float64
    
    func (f MyFloat) Abs() float64 {
      if f < 0 {
        return float64(-f)
      }
      return float64(f)
    }
    
    func main() {
      f := Myfloat(-math.Sqrt2)
      fmt.Println(f.Abs())
    }
    ```
- can declare methods with pointer receivers

## Pointer Receivers 
- The receiver type has the literal syntax `*T` for some type `T`. (Also, `T` cannot itself be a pointer such as `*int`.)
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
      return math.Sqrt(v.X*v.X + v.Y*v.Y)
    }

    //note: Receicver is a pointer to type Vertex 
    //with pointer receivers the original v values (v.X and v.Y can be changed)
    //if the pointer i.e * was removed the v.Scale(10) has no affect on v.Abs(), it would return '5'
    func (v *Vertex) Scale(f float64) {
      v.X = v.X * f
      v.Y = v.Y * f
    }

    func main() {
      v := Vertex{3, 4}
      v.Scale(10)
      fmt.Println(v.Abs()) //50
    }
    ```
    ```go
    package main
    
    import (
      "fmt"
      "math"
    )
    
    type Vertex struct {
      X, Y float64
    }
    
    func (v Vertex) Abs() float64 {
      return math.Sqrt(v.X*v.X + v.Y*v.Y)
    }

    //note receicver is not a pointer to type Vertex
    func (v Vertex) Scale(f float64) {
      v.X = v.X * f
      v.Y = v.Y * f
    }

    func main() {
      v := Vertex{3, 4}
      v.Scale(10)
      fmt.Println(v.Abs()) //5
    }
    
    ```
  - `Abs` and `Scale` methods written as functions
    - ```go
      package main
      
      import (
        "fmt"
        "math"
      )
      
      type Vertex struct {
        X, Y float64
      }
      
      func Abs(v Vertex) float64 {
        return math.Sqrt(v.X*v.X + v.Y*v.Y)
      }
      
      func Scale(v *Vertex, f float64) {
        v.X = v.X * f
        v.Y = v.Y * f
      }
      
      func main() {
        v := Vertex{3, 4}
        Scale(&v, 10)
        fmt.Println(Abs(v))
      } 
      ```
- Methods and Pointer indiriction
  - ```go
    package main
    import "fmt"
    type Vertex struct {
      X, Y float64
    }
    func (v *Vertex) Scale(f float64) {
      v.X = v.X * f
      v.Y = v.Y * f
    }
    func ScaleFunc(v *Vertex, f float64) {
      v.X = v.X * f
      v.Y = v.Y * f
    }
    func main() {
      v := Vertex{3, 4}
      v.Scale(2)
      ScaleFunc(&v, 10)
     
      p := &Vertex{4, 3}
      p.Scale(3)
      ScaleFunc(p, 8)
      
      fmt.Println(v, p)
    }
    ```
    - Functions with __pointer arguments__ must take a pointer
      - ```go
        var v Vertex
        ScaleFunc(v, 5) //compile error
        ScaleFunc(&v, 5) //OK
        ```
    - Methods with __pointer receivers__ take either a value or a pointer as the receiver when they are caled.
      - ```go
        var v Vertex
        v.Scale(5) //OK //GO interprets it as (&v).Scale(5)
        p := &v
        p.Scale(5) //OK
        ```
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
      return math.Sqrt(v.X*v.X + v.Y*v.Y)
    }
    func AbsFunc(v Vertex) float64 {
      return math.Sqrt(v.X*v.X + v.Y*v.Y)
    }
    func main() {
      v := Vertex{3, 4}
      fmt.Println(v.Abs())
      fmt.Println(AbsFunc(v))
      
      p := &Vertex{4, 3}
      fmt.Println(p.Abs())
      fmt.Println(AbsFunc(*p))
    }
    ```
    - functions that take a value argument must take a value of tht specific type.
      - ```go
        var v Vertex
        fmt.Println(AbsFunc(v))  // OK
        fmt.Println(AbsFunc(&v)) // Compile error!
        ```
    - Methods with value receiver take either a value or a pointer when they are called.
      - ```go
        var v Vertex
        fmt.Println(v.Abs()) // OK
        p := &v
        fmt.Println(p.Abs()) // OK  
        ```
- Choosing a value or pointer receiver
  - 2 reasons why pointer receivers are better than value receivers.
    - method can modify the value that the receiver points to.
	- avoiding copying is efficient, especially if the struct is large.
  - In general, all methods on a given type should have either value or pointer receivers, but not a mixture of both.
  - ```go
    package main
	import (
	  "fmt"
	  "math"
    )
         
    type Vertex struct {
    	X, Y float64
    }
    
    func (v *Vertex) Scale(f float64) {
    	v.X = v.X * f
    	v.Y = v.Y * f
    }
    
    func (v *Vertex) Abs() float64 {
    	return math.Sqrt(v.X*v.X + v.Y*v.Y)
    }
    
    func main() {
    	v := &Vertex{3, 4}
    	fmt.Printf("Before scaling: %+v, Abs: %v\n", v, v.Abs())
    	v.Scale(5)
    	fmt.Printf("After scaling: %+v, Abs: %v\n", v, v.Abs())
    } 
    ```

## Interfaces
- set of method signatures
- A value of interface type can hold any value that implements those methods.
- Interfaces are implemented implicitly. There is no explicit "implements" keyword
- Implicit interfaces decouple the definition of an interface from its implementation, which could then appear in any package without prearrangement.
- ```go
  package main
  
  import (
  	"fmt"
  	"math"
  )
  
  type Abser interface {
  	Abs() float64
  }
  
  func main() {
  	var a Abser
  	f := MyFloat(-math.Sqrt2)
  	v := Vertex{3, 4}
  
  	a = f  // a MyFloat implements Abser
	fmt.Println(a.Abs()) //1.41421...
  	
	a = &v // a *Vertex implements Abser
    fmt.Println(a.Abs())  //5
	
  	// In the following line, v is a Vertex (not *Vertex)
  	// and does NOT implement Abser.
  	//a = v
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
  ```
- Under the hood, interface values can be thought of as a tuple of a value and a concrete type: `(value, type)`. Interface holds the value of a specific underlying concrete type.
- Calling a method on an interface value executes the method of the same name on its underlying type.
- _nil receiver interface_: Interface values with `nil` underlying values.
  - ```go
    package main
	
	import "fmt"
	
    type I interface {
	  M()
	}
	
	type T struct {
	  S string
	}
	
	func (t *T) M() {
	 if t == nil {
		fmt.Println("<nil>")
		return
	 }
	 fmt.Println(t.S)
	}
	
	func main() {
		var i I
		var t *T
		i = t //initilized with 'nil' receiver.
		describe(i) //(<nil>, *main.T)
		i.M() //<nil>
		
		i = &T{"hello"}
		describe(i)  //&<"hello", *main.T
		i.M() "hello"
		
	}
	
	func describe() {
		fmt.Printf("(%v, %T)\n", i, i)
	}
    ```
  - In some languages this will trigger a null pointer exception
  - In Go it is common to write methods that gracefully handle being called with a nil receiver (as with the method M in this example.) 
- _nil interface_: holds neither value nor concrete Type.
  - ```go
    package main
	
	import "fmt"
	
    type I interface {
	  M()
	}
	
	func main() {
		var i I
		describe(i) //(<nil>, <nil>)
		i.M() 
		//panic: runtime error: invalid memory address or nil pointer dereference. 
		//[signal SIGSEGV: segmentation violation...
	}
	
	func describe() {
		fmt.Printf("(%v, %T)\n", i, i)
	}
    ```
 - _empty interface_: interface that specifies zero methods. using `interface{}`
   - ```go
     package main
	 import "fmt"
	 
	 func main() {
		var i interface{}
		describe(i) // (<nil>, <nil>)
	
		i = 42
		describe(i) //(42, int)
		
		i = "hello"
		describe(i) //{"hello", string}
	 }
	 func describe() {
		fmt.Printf("(%v, %T)\n", i, i)
	 }
     ```
- Type assertion of interface `t = i.(T)` `t, ok = i.(T)`
  - interface value `i` holds concrete type `T` and assigns the underlying value to variable `t`
  - To test whether an interface value holds a specific type, a type assertion can return two values: the underlying value and a boolean value that reports whether the assertion succeeded.
  - ```go
    var i interface{} = 'hello'
	
	s := i.(string)
	fmt.Println(s) //hello
	
	s, ok := i.(string)
	fmt.Println(s, ok) //hello true
	
	f, ok := i.(float64)
	fmt.Println(s, ok) //0 false
	
	f := i.(float64)
	fmt.Println(s) // panic: interface conversion: interface {} is string, not float64
    ```
	
### Type Switches
- A _type switch_ is a construct that permits several type assertions in series.
- its like a regular switch statement but the cases are _types_ not values.
- The declaration in a type switch has the same syntax as a type assertion `i.(T)`, but the specific type `T` is replaced with the keyword `type`.
- ```go
  package main
  
  import "fmt"
  
  func do (i interface{}) {
    switch v := i.(type) { //Note:- its not 'T' but the keyword 'type' 
	case int:
		fmt.Printf("Twice %v is %v\n", v, v*2)
	case string:
	    fmt.Printf("%q is %v bytes long\n", v, len(v))
	default:
	  fmt.Printf("type %T Not handled\n", v)
  }
  
  func main() {
    do(21) //Twice 21 is 42
	do("hello") //"hello" is 5 bytes long
	do(true) //type bool Not handled
  }
  ```

### Stringers
- `Stringer` interface is provided by `fmt` package
  - ```go
    type Stringer interface {
	  String() string
    }
    ```
- is a type that can describe itself as a string. ( think of it like a toString() in java)
- ```go
  package main
  import "fmt"
  
  type Person struct {
    Name string
	Age  int
  }
  
  func (p Person) String() string {
	  return fmt.Sprintf("%v (%v years)", p.Name, p.Age)
  }
  
  func main() {
    a := Person("Arthur Dent", 42)
	z := Person("Zaphod Beeblebrox" , 9001)
	fmt.Println(a, z)
  }
  ```
- [Excercise Stringers](#ex-stringers-1)

###  Errors
- Similar to `fmt.Stringer` there is `fmt.Error` interface.
  - ```go
    type error interface {
	  Error() string
	}
    ```
  - function often return error value, and the calling code should handle them, by checking for nil
  - ```go
	i, err := strconv.Atoi("42")
	if err != nil {
		fmt.Println("couldn't convert number: %v\n"), err)
		return
	}
	fmt.Println("onverted number: %v\n", i)
    ```
  - Simple Error handling
    - ```go
	  package main
      
      import "golang.org/x/tour/pic"
      
      import (
      	"fmt"
      	"strings"
      	"time"
      )
      
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
      		fmt.Println(err) //at 2021-05-15 08:23:24.362591 +0530 IST m=+0.000225390, it didn't work
      	}
      }
	  ```
  - [Excercise Errors](#ex-errors-1)
  
## Readers
- `io` package specifies `io.Reader`
- Reperesents the read end of stream data.
- Go std lib has many implementations of `io.Reader`
  - files, network connections, compressors, ciphers, etc..
- `func (T) Read(b []byte) (n int, err error)`
  - populates the given byte slice
  - returns number of bytes populated and an error value
  - returns an io.EOF error when stream ends
- Reading  bytes from a string
  - ```go
    package main
	
	import (
		"fmt"
		"io"
		"strings"
	)
	
    func main() {
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
    ```
- [Excercise Readers](#ex-readers-1)
- [Excercise Readers](#ex-readers-2)

## Images
- Package `image` and interface `Image`
- ```go
  package image
  
  type Image interface {
    ColorModel() color.Model
    Bounds() Rectangle
    At(x, y int) color.Color
  }
  ```
- `color.Model` and `color.Color` are also interfaces which have predetermined implementations `color.RGBA` and `color.RGBAModel`
- ```go
  package main
  
  import (
	"fmt"
	"image"
  )
  
  func main() {
	m := image.NewRGBA(image.Rect(0, 0, 100, 100))
	fmt.Println(m.Bounds())
	fmt.Println(m.At(0, 0).RGBA())
  }

  ```
- [Excercise Images](#ex-images-1)

## Concurrency
### Goroutines ###
- is a light-weight thread managed by Go runtime.
  - `go f(x, y, z)` Evaluation happens in the current goroutine
  - Execution of f, x, y, z happens in the new go-routine, i.e a new goroutine
    - goroutines run in the same address space - so access to shared memory must be synchronized.
	- `sync` package provides useful primitives.
```go
  package main
  import (
  	"fmt"
  	"time"
  )
  func say(s string) {
  	for i := 0; i < 5; i++ {
  		time.Sleep(100 * time.Millisecond)
  		fmt.Println(s)
  	}
  }
  func main() {
  	go say("world")
  	say("hello")
  }
```
  
### Channels ###
- are Typed conduits between _goroutines_, can send and receive values with the channel operator `<-`

```go
  ch <- v //send v to channel ch
  v := <- ch //receive from ch and assign to v
```
- channels must be created before use `ch = make(chan int)`
- send and receive block until the other side is ready. Allows for goroutines to synchronize without explicit locks or condition variables.

```go
  package main
  
  import "fmt"
  
  func sum(s []int, c chan int) {
  	sum := 0
  	for _, v := range s {
  		sum += v
  	}
  	c <- sum // send sum to c
  }
  
  func main() {
  	s := []int{7, 2, 8, -9, 4, 0}
  
  	c := make(chan int)
  	go sum(s[:len(s)/2], c)
  	go sum(s[len(s)/2:], c)
  	x, y := <-c, <-c // receive from c
  
  	fmt.Println(x, y, x+y)
  }
```

### Buffered Channels ###
- Provide buffer length as second arg to make to initialize buffered channel
- `ch := make(chan int, 100)`
- Sends to buffered channel are blocked only when full.
- Receives block when buffer is empty.

```go
  package main
  
  import "fmt"
  
  func main() {
  	ch := make(chan int, 2)
  	ch <- 1
  	ch <- 2
  	ch <- 3 //fatal error: all goroutines are asleep - deadlock!
  	fmt.Println(<-ch)
  	fmt.Println(<-ch)
  }
```
  
### Range and Close ###
- __Sender__ can `close(c)` channel to indicate no more values will be sent.
- __Receivers__ can test if a channel has been closed by assigning a second variable. ` v, ok := <- ch`
- _range loop_ recievers_ `for i := range c` receives values from the channel until it is closed.
- Only _senders_ should close the channel, never the receiver. Sending on closed channel will cause _panic_
- unlike files channels need not be closed. Closing is only necessary when the receiver must be told there are no more values coming, such as to terminate a _range loop_

```go
  package main
  
  import (
  	"fmt"
  )
  
  func fibonacci(n int, c chan int) {
  	x, y := 0, 1
  	for i := 0; i < n; i++ {
  		c <- x
  		x, y = y, x+y
  	}
  	close(c)
  }
  
  func main() {
  	c := make(chan int, 10)
  	go fibonacci(cap(c), c)
  	for i := range c {
  		fmt.Println(i)
  	}
  }
```

### Select and Goroutine ###
- The `select` lets a goroutne to wait on multiple communication operations. (both send or receive on the channels)
- Select statement waits until the communication(send or receive operation) is prepared for some cases to begin
- all channels are evaluated
- if multiple can proceed, `select` chooses one pseudo-randomly.
- A `default` clause, if present, executes immediateliy if no channels are ready.

```go
  package main
  
  import "fmt"
  
  func fibonacci(c, quit chan int) {
  	x, y := 0, 1
  	for {
  		select {
  		case c <- x:
  			x, y = y, x+y
  		case <-quit:
  			fmt.Println("quit")
  			return
  		}
  	}
  }
  
  func main() {
  	c := make(chan int)
  	quit := make(chan int)
  	go func() {
  		for i := 0; i < 10; i++ {
  			fmt.Println(<-c)
  		}
  		quit <- 0
  	}()
  	fibonacci(c, quit)
  }
```

- _Default Selection_
  - `default:` case in select is run when no other case is ready.
  - use `default:` case to try to send/receive without blocking
  - The default statement in the select statement is used to protect select statement from blocking
```go
    package main
    
    import (
    	"fmt"
    	"time"
    )
    
    func main() {
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
```
	- [Excercise - Equivalent Binary Trees](ex-goroutine-1)

### sync.Mutex
- ensure only one goroutine can access the variable at a time -  _mutual exclusion_
- `sync.Mutex` and `Lock()` and `Unlock()` methods
- can slso use defer to ensure Unlock is called

```go
  import (
  	"fmt"
  	"sync"
  	"time"
  )
  
  // SafeCounter is safe to use concurrently.
  type SafeCounter struct {
  	mu sync.Mutex
  	v  map[string]int
  }
  
  // Inc increments the counter for the given key.
  func (c *SafeCounter) Inc(key string) {
  	c.mu.Lock()
  	// Lock so only one goroutine at a time can access the map c.v.
  	c.v[key]++
  	c.mu.Unlock()
  }
  
  // Value returns the current value of the counter for the given key.
  func (c *SafeCounter) Value(key string) int {
  	c.mu.Lock()
  	// Lock so only one goroutine at a time can access the map c.v.
  	defer c.mu.Unlock()
  	return c.v[key]
  }
  
  func main() {
    c := SafeCounter{v: make(map[string]int)}
    for i := 0; i < 1000; i++ {
      go c.Inc("somekey")
    }
    
    time.Sleep(time.Second)
    fmt.Println(c.Value("somekey"))
  }
```
- [Excercise: Web Crawler](#ex-mutex-1)



# Questions and Excercises
## ex-range-1
- _Print the powers of 2 (i.e 2**i) for i=0 to 10. Hint1: shift the bits of 1 by N. Hint1: use range_
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

## Find contiguous array
- _Given a sorted array of unique integers, write a method that takes this array and returns an array of ranges of contiguous values. Each range is an array with the start and end integers (inclusive) of the contiguous portions of the original array_
    - `Input: [2, 3, 6, 7, 8, 9, 14, 15, 16, 17] Output: [[2, 3], [6, 9], [14, 17]]`
	- `Input: [8, 9] Output: [[8, 9]]`

### ex-slice-1
- _Implement Pic. It should return a slice of length dy, each element of which is a slice of dx 8-bit unsigned integers. When you run the program, it will display your picture, interpreting the integers as grayscale (well, bluescale) values._
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

## ex-maps-1
- _Implement WordCount. It should return a map of the counts of each “word” in the string s. The wc.Test function runs a test suite against the provided function and prints success or failure. You might find strings.Fields helpful._
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

## ex-closure-1
- _Implement a fibonacci function that returns a function (a closure) that returns successive fibonacci numbers 0, 1, 1, 2, 3, 5, ..._
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

## ex-stringers-1
- _Make the IPAddr type implement fmt.Stringer to print the address as a dotted quad._
  - ```go
  package main
  import "fmt"
  type IPAddr [4]byte
  // TODO: Add a "String() string" method to IPAddr.
  func (ip IPAddr) String() string {
    return fmt.Sprintf("%d.%d.%d.%d", ip[0], ip[1], ip[2], ip[3])
  }
  func main() {
  	hosts := map[string]IPAddr{
  		"loopback":  {127, 0, 0, 1},
  		"googleDNS": {8, 8, 8, 8},
  	}
  	for name, ip := range hosts {
  		fmt.Printf("%v: %v\n", name, ip)
  	}
  }
  ```

## ex-errors-1
- Copy your `Sqrt` function from the earlier exercise and modify it to return an `error` value. 
- `Sqrt` should return a non-nil `error` value when given a negative number, as it doesn't support complex numbers. 
- Create a new type `type ErrNegativeSqrt float64` and make it an `error` by giving it a `func (e ErrNegativeSqrt) Error() string` method such that `ErrNegativeSqrt(-2).Error()` returns "cannot Sqrt negative number: -2". 
- Note: A call to fmt.Sprint(e) inside the Error method will send the program into an infinite loop. 
You can avoid this by converting e first: fmt.Sprint(float64(e)). Why?. 
- Change your `Sqrt` function to return an `ErrNegativeSqrt` value when given a negaive number.
- ```go 
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
   
   func main() {
    testSqrt2()
   }
   ```

## ex-readers-1
- _Implement a Reader type that emits an infinite stream of the ASCII character 'A'._
- ```go
  package main
  
  import (
  	"golang.org/x/tour/reader"
   )
  
  //--- implement a Reader thet emits stream of Ascii character 'A'
  // in the Tour of Go the problem statement is ambigous due to the phrase 'infinite stream used'
  type MyReader struct{}
  
  func (r MyReader) Read(b []byte) (int, error) {
  	for i := range b {
  		b[i] = 65 //or 'A'
  	}
  	return len(b), nil
  }
  
  func main() {
  	reader.Validate(MyReader{}) //OK!
  }
  ```
  
### ex-readers-2
- _Implement a rot13Reader that implements io.Reader and reads from an io.Reader, modifying the stream by applying the rot13 substitution cipher to all alphabetical characters._
- ```go
  package main
  
  import (
  	"io"
  	"os"
  	"strings"
  )
  
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
  		b[i] = rotate13(b[i])
  	}
  	return n, err
  }
  
  func main() {
  	s := strings.NewReader("Lbh penpxrq gur pbqr!")
  	r := rot13Reader{s}
  	io.Copy(os.Stdout, &r)
  }
  ```

## ex-images-1
- _Modify the [picture generator](#ex-slice-1) to return an `Image` instead of a slice (i.e [][]uint8)_
- ```go
  package main
  
  import "golang.org/x/tour/pic"
  import "image"
  import "image/color"
  
  type MyImage struct{
  	width int
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
  
  func main() {
  	m := MyImage{100, 100}
  	pic.ShowImage(m)
  }
  ```

### ex-goroutine-1

- _Equivalent Binary Trees_
- _Check if 2 trees are equiAvalent, use `import golang.org/x/tour/tree`_
- _Tree is defined as_
  - ```go
    type Tree struct {
	  Left  *Tree
	  Value int
	  Right *Tree
    }
    ```
- ```go
  package main
  
  import "golang.org/x/tour/tree"
  import "fmt"
  
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
  
  func main() {
  	
  	t1 := tree.New(2)
  	t2 := tree.New(2)
  	t3 := tree.New(3)
  	fmt.Println(Same(t1, t2))
  	fmt.Println(Same(t1, t3))
  }
  ```

### ex-mutex-1
- Web Crawler
- ```go
  package main
  
  import (
  	"fmt"
  	"sync"
  	"time"
  )
  
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
  
  func main() {
  	go Crawl("https://golang.org/", 4, fetcher)
  	go Crawl("https://golang.org/pkg/", 2, fetcher)
  	time.Sleep(time.Second)
  }
  
  ```

# Go Concurrency Patterns (@Rob Pike)
## Concurrency in Go
- it a way to structure the software
- composition of independently ececution computations
- it is not parallelism
- `goroutine` is designed to run independantly
``` go
	func DoSomething() {...}
    func main() {
		go DoSomething()
	}
```
  - when main() exits the program stops
  - Has its own call stack, grows and shrinks as required. System will take care of the stack growth.
  - So, goroutines start of cheap, its practicle to have thousands, even hunderds of thousands of goroutines
  - IT IS NOT A THREAD
  - There might be one thread in a program with thousands of goroutines
  - goroutines are multiplexed dynamically onto threads, as needed
  - _think of goroutines as a cheap thread._
- A channel in go provides a connection between two goroutines
- sending to channel and receiving from a channel are blocking operations.
- fundamental concept - channels help in communicating as well as synchorizing the operation (i.e sene and receive)
- `Buffered Channel` - Buffer removes synchronization (more later)

## Concurrenct Patterns
- Idea: Communication coupled with synchronization - go Channels
  - Don't communicate by sharing memory, share memory by communicating.
  - You dont have a blob of memory protected by locks and mutexes and condition variables, instead
  - send the data back and forth to the goroutines via channels
- "Patterns" (not in the object oriented sense, but examples that do some insteresting things)

### Generator: function that returns a channel
- `channels` are first-class values, just like strings or integers
  - ```go
    //Concurrent Pattern: func that returns a channel
    func boring(msg string) <-chan string { //returns recieve-only channel
      c := make(chan string)
      go func() {
        for i := 0; ; i++ {
            c <- fmt.Sprintf("%s %d", msg, i)
            time.Sleep(time.Duration(rand.Intn(1e3)) * time.Millisecond)
        }
      }()
      return c
    }
    
    func callBoring() {
      c := boring("very boring!")
      for i := 0; i < 5; i++ {
        fmt.Printf("You say: %q\n", <-c)
      }
      fmt.Println("You're boring; I am leaving..")
    }
    func main() {
      callBoring()
    }
    ```
	
### Channels as a handle to service
- ```go
  func main() {
    joe := boring("Joe")
	ann := boring("ann")
	for i := 0; i < 5; i++ {
  		fmt.Printf(<-joe)
  		fmt.Printf(<-ann)		
  	}
  }
  ```
  
### Multiplexing
- In the above while joe has not yet received the value, the channel is blocked for ann, (say is more talktive)
- Getaround by a fan-in function or a multiplier
- ```go
  func fanIn(input1, input2 <-chan string) <-chan string {
    c := make(chan string)
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
  func channelMultiplexing() {
    c := fanIn(boring("Joe"), boring("Ann"))
    for i := 0; i < 10; i++ {
   	  fmt.Println(<-c)
	}
    fmt.Println("You're both boring; I am leaving..")
  }
  /*
  Joe 0
  Ann 0
  Ann 1
  Joe 1
  Ann 2
  Joe 2
  Ann 3
  Joe 3
  Ann 4
  Joe 4
  You're both boring; I am leaving..
  */
  ```

### Multiplexing but with sequencing (control)
- channel is a first class value, can send a channel on a channel
- making a goroutine wait for the turn
- creating a FanIn
- ```go
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
  ```

### Fan-in using select
- Refactor the FanIn() or FanIn2() to use select, with only one goroutine
- ``` go
  func fanIn2(input1, input2 <-chan Message) <-chan Message {
  	c := make(chan Message)
  	go func() {
  		for {
		select {
		case s := <-
		}
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
  ```
