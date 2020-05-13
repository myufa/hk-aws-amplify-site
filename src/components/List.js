import React from "react";


function renderListItem(list, del) {  
    const listItems = list.map(item => (    
        <li key={item.id} className="list-group-item">      
            <button type="button" className="btn btn-danger" onClick={() => del(item.id)}>        
                Delete      
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {item.name}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  {item.content}   
        </li>
    ));
    return <ul className="list-group list-group-flush">{listItems}</ul>;
}
export default props => (  
    <div>    
        <legend>List</legend>    
        <div className="card" style={{ width: "25rem" }}>      
            {renderListItem(props.list, props.delete)}    
        </div>  
    </div>);
