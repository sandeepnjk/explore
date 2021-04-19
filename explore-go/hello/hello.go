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
