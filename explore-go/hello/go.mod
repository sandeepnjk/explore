module example.com/hello

go 1.16

require (
	example.com/greetings v0.0.0-00010101000000-000000000000
	github.com/rogpeppe/godef v1.1.2 // indirect
)

replace example.com/greetings => ../greetings
