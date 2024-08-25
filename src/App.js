import React, { Component } from 'react';
import './App.css';
import MyPokeDex from './component/Pokedex.component/MyPokeDex';
const COLORS = {
  Psychic: "#f8a5c2",
  Fighting: "#f0932b",
  Fairy: "#c44569",
  Normal: "#f6e58d",
  Grass: "#badc58",
  Metal: "#95afc0",
  Water: "#3dc1d3",
  Lightning: "#f9ca24",
  Darkness: "#574b90",
  Colorless: "#FFF",
  Fire: "#eb4d4b"
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      card: null, 
    };
  }

  componentDidMount() {
    fetch('http://localhost:3030/api/cards')
      .then(response => response.json())
      .then(data => {
        console.log('Data fetched:', data);
        if (Array.isArray(data.cards) && data.cards.length > 0) {
          this.setState({ card: data.cards[1] });
        } else {
          console.error('No cards found in response.');
        }
      })
      .catch(error => console.error('Error fetching card data:', error));
  }

  render() {
    const { card } = this.state;

    return (
      <div className="App">
        {card ? (
          <MyPokeDex card={card}  />
        ) : (
          <p>Loading...</p>
        )}
        
      </div>
    );
  }
}

export default App;
