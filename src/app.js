import * as React from 'react';
import ReactDOM from 'react-dom';
import { NavLink, HashRouter, Switch, Route } from 'react-router-dom';
import createHashHistory from 'history/createHashHistory';
const history = createHashHistory(); // Use to nagivate to a specific path, for instance: history.push('/')
import { noteService } from './services';

class ErrorMessage extends React.Component {
  constructor() {
    super();

    this.message = '';
  }

  render() {
    // Only show when this.message is not empty
    let displayValue;
    if(this.message=='') displayValue = 'none';
    else displayValue = 'inline';

    return (
      <div style={{display: displayValue}}>
        <b><font color='red'>{this.message}</font></b>
        <button ref='closeButton'>Close</button>
      </div>
    );
  }

  componentDidMount() {
    errorMessage = this;
    this.refs.closeButton.onclick = () => {
      this.message = '';
      this.forceUpdate();
    };
  }

  componentWillUnmount() {
    errorMessage = null;
  }

  set(message) {
    this.message = message;
    this.forceUpdate();
  }
}
let errorMessage; // ErrorMessage-instance

class NoteList extends React.Component<{}> {
  constructor() {
    super();

    this.notes = [];
  }

  render() {
    let listItems = [];
    for(let note of this.notes) {
      // NavLink is an extension of Link that can add style on the link that matches the active path
      listItems.push(<li key={note.id}><NavLink activeStyle={{color: 'green'}} to={'/edit/'+note.id}>{note.title}</NavLink></li>);
    }

    return (
      <div>
        Notes:
        <ul>
          {listItems}
        </ul>
        <button>Add note</button>
      </div>
    );
  }

  componentDidMount() {
    noteService.getNotes().then((notes) => {
      this.notes = notes;
      this.forceUpdate();
    }).catch((error) => {
      if(errorMessage) errorMessage.set('Error getting notes: ' + error.message);
    });
  }
}

class NoteEdit extends React.Component {
  constructor(props) {
    super(props);

    this.id = props.match.params.id;
  }

  render() {
    return (
      <div>
        Note id: {this.id}
      </div>
    );
  }

  // Called when the this.props-object change while the component is mounted
  // For instance, when navigating from path /edit/1 to /edit/2
  componentWillReceiveProps(newProps) {
    this.id = newProps.match.params.id;
    // To update the view and show the correct note data, rerun database query here
  }
}

ReactDOM.render((
  <HashRouter>
    <div>
      <ErrorMessage />
      <table style={{width: '100%'}}><tbody>
        <tr>
          <td valign='top' style={{width: '30%'}}>
            <NoteList />
          </td>
          <td valign='top'>
            <Switch>
              <Route exact path='/edit/:id' component={NoteEdit} />
            </Switch>
          </td>
        </tr>
      </tbody></table>
    </div>
  </HashRouter>
), document.getElementById('root'));
