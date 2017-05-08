### React single-page web app + Golang authenticaton server + Auth0 Lock authentication

To start up:

Copy `env.example` and `js/assets/auth0-variables.js.example` to 

* `.env`
* `js/assets/auth0-variables.js`

with appropriate variables from Auth0

`go run main.go`

http://localhost:3000 for page that authenticates via auth server to Auth0.

##### Issues/Todos
While the `Log out` link correctly removes Auth0 token from local browser storage, the page isn't set to refresh.
But any refresh or return to `/` takes you back to the login button screen.
