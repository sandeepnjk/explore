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
- Importing packages from published modules
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
- Return and Handle Error
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