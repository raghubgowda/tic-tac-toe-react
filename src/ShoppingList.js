import React from 'react';

class ShoppingList extends React.Component{
    render(){
        return(
            <div className="shopping-list">
                <h1>Shopping list for {this.props.name}</h1>
                <ul>
                    <li>Instagram</li>
                    <li>Facebook</li>
                    <li>Twitter</li>
                </ul>
            </div>
        );
    }
}

export default ShoppingList;