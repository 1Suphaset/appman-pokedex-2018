import React, { useState, useEffect } from 'react';
import './MyPokeDex.css';
import plusImageUrl from '../../cute.png';
import PokemonCard from '../PokemonCard.component/PokemonCard';

const ProgressBar = ({ value, max }) => {
    const percentage = (value / max) * 100;
    return (
        <div className='Bar'>
            <div className='Bar-fill' style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const generateHappinessImages = (level, imageUrl) => {
    return Array(level).fill(imageUrl); 
};

const MyPokeDex = () => {
    const [setPokemonData] = useState([]);
    const [addCard, setAddCard] = useState(false);
    const [hoveredCardId, setHoveredCardId] = useState(null);
    const [addedCards, setAddedCards] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3030/api/cards')
            .then(response => response.json())
            .then(data => {
                if (data.cards && data.cards.length > 0) {
                    setPokemonData(data.cards);
                }
            })
            .catch(error => console.error('Error fetching card data:', error));
    }, []);

    const openCards = () => setAddCard(true);
    const closeCards = () => setAddCard(false);

    const handleAddCard = (newCard) => {
        if (!addedCards.some(card => card.id === newCard.id)) {
            setAddedCards(prevCards => [...prevCards, newCard]);
        } else {
            console.log('Card already added');
        }
    };
    const handleRemoveCard = (cardId) => {
        setAddedCards(prevCards => prevCards.filter(card => card.id !== cardId));
    };

    return (
        <div className='Pokedex-Con'>
            <nav>My PokeDex</nav>
            <div className='Cards-Con' onClick={closeCards}>
                {addedCards.map((card) => (
                    <div 
                        className='Card-item' 
                        key={card.id}
                        onMouseEnter={() => setHoveredCardId(card.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                    >
                        <img src={card.imageUrl || 'https://via.placeholder.com/150'} alt={card.name || 'Pokemon'} className='Card-img' />
                        <div className='Card-detail'>
                            <div className='Card-Name'>
                                <p>{(card.name || 'Unknown').toUpperCase()}</p>
                                <h1 
                                    className='del-botton' 
                                    style={{ display: hoveredCardId === card.id ? 'block' : 'none' }} 
                                    onClick={() => handleRemoveCard(card.id)}>X</h1>
                            </div>
                            <div className='Card-status'>
                                <div className='stat'>
                                    <h3>HP</h3>
                                    <ProgressBar value={Math.min(Math.max(card.hp || 0, 0), 100)} max={100} />
                                </div>
                                <div className='stat'>
                                    <h3>STR</h3>
                                    <ProgressBar value={Math.min((card.attacks?.length || 0) * 50, 100)} max={100} />
                                </div>
                                <div className='stat'>
                                    <h3>WEAK</h3>
                                    <ProgressBar value={Math.min((card.weaknesses?.length || 0) * 100, 100)} max={100} />
                                </div>
                            </div>
                            <div className='Happiness-images'>
                                {generateHappinessImages(Math.max(0, Math.round(((Math.min(Math.max(card.hp || 0, 0), 100) / 10) + (card.attacks.reduce((total, attack) => {
                                    const match = attack.damage ? attack.damage.match(/\d+/) : null;
                                    return total + (match ? parseInt(match[0], 10) : 0);
                                }, 0) / 10) + 10 - (Math.min((card.weaknesses?.length || 0) * 100, 100) / 100)) / 5)), plusImageUrl).map((url, index) => (
                                    <img key={index} src={url} alt={`Happiness Level ${index + 1}`} className='Happiness-image' />
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='footer'>
                <h1 onClick={openCards}>+</h1>
            </div>
            {addCard && (
                <PokemonCard addedCards={addedCards} onAddCard={handleAddCard} />
            )}
        </div>
    );
};

export default MyPokeDex;
