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
  - adding 'rsc.io/quote' package  
