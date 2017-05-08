### React single-page web app + Golang authenticaton server + Auth0 Lock authentication

Original implementation described here: https://auth0.com/blog/authentication-in-golang/

The blog post uses an outdated API for implementing Auth0's Lock interface.
This repo uses v.10.9 of Auth0's Lock implementation, which is the latest version at this time.

#### To start up:

Copy `env.example` and `js/assets/auth0-variables.js.example` to 

* `.env`
* `js/assets/auth0-variables.js`

with appropriate variables from Auth0

`go run main.go`

http://localhost:3000 for page that authenticates via auth server to Auth0.

#### Issues/Todos
While the `Log out` link correctly removes Auth0 token from local browser storage, the page isn't set to refresh.
But any refresh or return to `/` takes you back to the login button screen.
