// App component launches the application
var App = React.createClass({
  componentWillMount: function() {
    this.setupAjax();
    this.createLock();
    this.setState({idToken: this.getIdToken()})
  },
  createLock: function() {
    this.lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_CLIENT_DOMAIN)
    this.lock.on('authenticated', function(response) {
      localStorage.setItem('userToken', response.idToken);
      this.setState({idToken: this.getIdToken});
    }.bind(this))
  },
  setupAjax: function() {
    $.ajaxSetup({
      'beforeSend': function(xhr) {
        if (localStorage.getItem('userToken')) {
          xhr.setRequestHeader('Authorization',
            'Bearer ' + localStorage.getItem('userToken'));
        }
      }
    });
  },
  // Gets user's JWT if already authenticated, or stores upon first log in.
  getIdToken: function() {
    var idToken = localStorage.getItem('userToken');
    if (!idToken) {
      if (!this.state) {
        idToken = "";
      }
      else {
        idToken = this.state.IdToken;
        localStorage.setItem('userToken', idtoken);
      }
    }
    return idToken;
  },
  render: function() {
    if (this.state.idToken) {
      return (<LoggedIn idToken={this.state.idToken} />);
      // return (<LoggedIn lock={this.lock} idToken={this.state.idToken} />);
    } else {
      return (<Home lock={this.lock} />);
    }
  }
});

// Home component shows items for all users (logged in and non-logged in)
var Home = React.createClass({
  showLock: function() {
    this.props.lock.show();
  },
  render: function() {
    return (
      <div className="container">
      <div className="col-xs-12 jumbotron text-center">
        <h1>A Title</h1>
        <p>Log in to see a set of Things!</p>
        <a onClick={this.showLock} className="btn btn-primary btn-lg btn-login btn-block">Sign In</a>
      </div>
    </div>);
  }
});

// Loggedin component only shows items for logged in users (with a token)
var LoggedIn = React.createClass({
  getInitialState: function() {
    return {
      profile: null,
      things: null
    }
  },
  componentDidMount: function() {
    this.serverRequest = $.get('http://localhost:3000/things', function(result) {
      this.setState({
        profile: "foo", // get this from lock object upon successful login
        things: result,
      });
    }.bind(this));
  },
  logout: function() {
    localStorage.removeItem('userToken');
    // Ideally this should redirect to Home component automatically, instead of needing a refresh
  },
  render: function() {
    if (this.state.profile) {
      return (
        <div className="col-lg-12">
          <span className="pull-right">{this.state.profile.nickname} <a onClick={this.logout}>Log out</a></span>
          <h2>All the Things!</h2>
          <p>Here's a list of Things below</p>
          <div className="row">
            {this.state.things.map(function(thing, i){
              return <Thing key={i} thing={thing} />
            })}
          </div>
        </div>);
    } else {
      return (<div>Loading...</div>);
    }
  }
});

// Thing component shows details about Things (resource details from API)
var Thing = React.createClass({
  upvote : function() {},
  downvote : function() {},
  getInitialState: function() {
    return {
      voted: null
    }
  },
  render: function() {
    return (
      <div className="col-xs-4">
      <div className="panel panel-default">
        <div className="panel-heading">{this.props.thing.Name} <span className="pull-right">{this.props.thing.Id}</span></div>
        <div className="panel-body">
          {this.props.thing.Slug}
        </div>
        <div className="panel-footer">
          <a onClick={this.upvote} className="btn btn-default">
            <span className="glyphicon glyphicon-thumbs-up"></span>
          </a>
          <a onClick={this.downvote} className="btn btn-default pull-right">
            <span className="glyphicon glyphicon-thumbs-down"></span>
          </a>
        </div>
      </div>
    </div>);
  }
});

ReactDOM.render(<App />, document.getElementById('app'));
