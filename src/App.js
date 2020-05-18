import React, { Component } from "react";
import List from "./components/List";

import Amplify, { API } from "aws-amplify";
import aws_exports from "./aws-exports";
import { withAuthenticator } from "aws-amplify-react";

Amplify.configure(aws_exports);

class App extends Component {  
  constructor(props) {    
    super(props);    
    this.state = {      
      content: "",      
      name: "",      
      list: [],      
      item: {},      
      showDetails: false,
      formData: []    
    };  
  }
  async componentDidMount() {    
    await this.fetchList(); 
    await this.fetchFormData(); 
  }  
  handleChange = event => {    
    const id = event.target.id;    
    this.setState({ [id]: event.target.value });  
  };
  handleSubmit = async event => {    
    event.preventDefault();    
    await API.post("UserApi", "/items", {      
      body: {        
        id: Date.now(),        
        name: this.state.name,        
        content: this.state.content      
      }    
    })
    .then(resp=>{console.log(resp);})
    .catch(err=>{console.log(err);});
    this.setState({ content: "", name: "" });    
    this.fetchList();  
  };  
  async fetchList() {    
    const response = await API.get("UserApi", "/items")
    .catch((err)=>{console.log("fetchlist error", err);});  
    if (response){
      this.setState({ list: [...response] });  
    }
  }
  async fetchFormData(){
    const response = await API.get("UserApi", "/form-data")
    .catch((err)=>{console.log("fetch form data error", err);});  
    if (response){
      this.setState({ formData: response.rows });  
    }
    // return (
    //   <table>
    //   this.state.formData.map(()=>{

    //   })
    //   </table>
    // )
  }
  // loadDetailsPage = async id => {    
  //   const response = await API.get("UserApi", "/items/" + id)
  //   .catch((err)=>{console.log("details error: ", err);});
  //   this.setState({ item: { ...response }, showDetails: true });  
  // };
  loadListPage = () => {    
    this.setState({ showDetails: false });  
  };
  delete = async id => {    
    await API.del("UserApi", "/items/object/" + id);
    this.fetchList();
  };

  renderFormData() {
    return (
      <h1>{Object.keys(this.state.formData).length}</h1>
    )
  }

  render() {    
    return (      
      <div className="container">        
        <form onSubmit={this.handleSubmit}>          
          <legend>Add</legend>          
          <div className="form-group">            
            <label htmlFor="name">Name</label>            
            <input type="text" className="form-control" id="name" placeholder="name" value={this.state.name} onChange={this.handleChange}/>
          </div>          
          <div className="form-group"> 
            <label htmlFor="content">Content</label> 
            <textarea className="form-control" id="content" placeholder="Content" value={this.state.content} onChange={this.handleChange}/>          
          </div>          
          <button type="submit" className="btn btn-primary">Submit</button>        
        </form>
        <hr/>
        <List list={this.state.list} delete={this.delete} />
        <div>
          {this.renderFormData()}
        </div>
      </div>    
    );  
  }
}

/*{this.fetchFormData()}*/
{/* <table>
          <tr> <th>Timestamp</th> <th>Email Address</th> <th>First name</th> <th>Last name</th> <th>Which university do you attend?</th> <th>What year are you?</th> <th>Why are you interested in becoming a member of HumanKind?</th> </tr>
          {
          this.fetchFormData().map((row)=>{
            return (
              <tr>
                {row.map((item)=>{
                  return (
                    <td>item</td>
                  );
                })}
              </tr>
            );
          })
          }
        </table> */}




//<AmplifySignOut />
export default withAuthenticator(App)
//export default App;