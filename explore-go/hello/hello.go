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

	explore_multiple_return_values()

	explore_slice()

	explore_map()

}
func explore_multiple_return_values() {
	message, err := greetings.Hello("Rambo")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(message)

}

func explore_map() {
	//in: list of names
	//out: map of greetings and name
	names := []string{"John", "Jani", "Janardhan"}
	messages, err := greetings.Hellos(names)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(messages)

}

func explore_slice() {
	var s []byte
	s = make([]byte, 5, 5)
	log.Printf("initial s capacity %v and lenth %v", cap(s), len(s))

	s = s[2:4]
	log.Printf("modified s capacity %v and lenth %v", cap(s), len(s))

	//double the capacity of s
	t := make([]byte, len(s), (cap(s)+1)*2)
	copy(t, s)
	s = t
	log.Printf("increased s capacity %v and lenth %v", cap(s), len(s))
}
