package main

import (
	"encoding/json"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"net/http"
	"os"
)

type Thing struct {
	Id   int
	Name string
	Slug string
}

var things = []Thing{
	Thing{Id: 1, Name: "Thing 1", Slug: "Slug 1"},
	Thing{Id: 2, Name: "Thing 2", Slug: "Slug 2"},
	Thing{Id: 3, Name: "Thing 3", Slug: "Slug 3"},
	Thing{Id: 4, Name: "Thing 4", Slug: "Slug 4"},
	Thing{Id: 5, Name: "Thing 5", Slug: "Slug 5"},
}

func main() {
	router := mux.NewRouter()

	router.Handle("/", http.FileServer(http.Dir("./views/")))

	router.Handle("/things", ThingsHandler).Methods("GET")
	router.Handle("/status", Status).Methods("GET")
	router.Handle("/thing/{slug}/foo", AddToThingHandler).Methods("POST")

	router.PathPrefix("/assets/").Handler(http.StripPrefix("/assets/", http.FileServer(http.Dir("./assets/"))))

	http.ListenAndServe(":3000", handlers.LoggingHandler(os.Stdout, router))
}

/******************************************/
/* Handlers for respective HTTP responses */
/******************************************/

var NotImplemented = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Not Implemented"))
})

var Status = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("We're OK"))
})

var ThingsHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	payload, _ := json.Marshal(things)

	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(payload))
})

var AddToThingHandler = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	var thing Thing
	vars := mux.Vars(r)
	slug := vars["slug"]

	for _, t := range things {
		if t.Slug == slug {
			thing = t
		}
	}

	w.Header().Set("Content-Type", "application/json")

	if thing.Slug != "" {
		payload, _ := json.Marshal(thing)
		w.Write([]byte(payload))
	} else {
		w.Write([]byte("Thing not found..."))
	}
})
