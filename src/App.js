import React, {Component} from "react";
import "./App.css"
import axios from "axios";
import {Card, Icon, Image, Form, Header, Table} from 'semantic-ui-react'


class App extends Component {
   constructor(props) {
      super(props);

      this.state = {users: [], searchTerm: '', alphabetical: 'az'};

      this.handleChange = this.handleChange.bind(this);
   }

   componentDidMount() {
      axios
         .get("https://teacode-recruitment-challenge.s3.eu-central-1.amazonaws.com/users.json")
         .then(response => {
            console.log(response.data);
            this.setState({users: response.data});
         })
         .catch(error => {
            console.log(error);
         });
   }

   handleChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
         [name]: value
      });
   }

   render() {
      let sortedUsers;

      if (this.state.alphabetical === "az") {
         console.log("sort");
         sortedUsers = this.state.users.sort((a, b) =>
            a.first_name > b.first_name ? 1 : -1
         );
      } else {
         sortedUsers = this.state.users.sort((a, b) =>
            a.first_name < b.first_name ? 1 : -1
         );
      }

      let filteredUsers = sortedUsers;

      if (this.state.searchTerm)
         filteredUsers = this.state.users.filter(u =>
            u.first_name.startsWith(this.state.searchTerm)
         );

      const userNames = filteredUsers.map(u => {
         return <User key={u.id} name={u.first_name} lname={u.last_name} avatar={u.avatar} email={u.email}
                      gender={u.gender}/>;
      });
      return (
         <div>
            <Form onSubmit={this.handleSubmit}>
               <Form.Field>
                  <label>
                     Search for user:
                     <input
                        type="text"
                        name="searchTerm"
                        value={this.state.searchTerm}
                        onChange={this.handleChange}
                     />
                  </label>
                  <input type="submit" value="Submit"/>
               </Form.Field>
            </Form>
            <select
               name="alphabetical"
               value={this.state.alphabetical}
               onChange={this.handleChange}
            >
               <option selected value="az">
                  A to Z
               </option>
               <option value="za">Z to A</option>
            </select>

            {userNames}

         </div>
      );
   }
}

class User extends Component {
   render() {
      return (
         <div className='card-grid'>
            <Table basic='very' celled collapsing>
               <Table.Body>
                  <Table.Row>
                     <Table.Cell>
                        <Header as='h4' image>
                           <Image src={this.props.avatar} rounded size='mini'/>
                           <Header.Content>
                              {this.props.name}
                              <Header.Subheader>{this.props.lname}</Header.Subheader>
                           </Header.Content>
                        </Header>
                     </Table.Cell>
                     <Table.Cell>{this.props.email}</Table.Cell>
                  </Table.Row>
               </Table.Body>
            </Table>
         </div>
      );
   }
}

const styleLink = document.createElement("link");
styleLink.rel = "stylesheet";
styleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css";
document.head.appendChild(styleLink);

export default App;
