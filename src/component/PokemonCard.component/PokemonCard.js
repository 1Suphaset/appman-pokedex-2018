import React, { useState, useEffect } from 'react';
import plusImageUrl from '../../cute.png';
import './PokemonCard.css'
import Search from "../../search.png"

const ProgressBar = ({ value, max }) => {
    const percentage = (value / max) * 100;
    return (
        <div className='Cards-Bar'>
            <div className='Cards-Bar-fill' style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const generateHappinessImages = (level = 0, imageUrl) => {
    const validLevel = Math.max(0, Math.floor(level));
    const maxImages = 20;
    const clampedLevel = Math.min(validLevel, maxImages);

    if (isNaN(clampedLevel) || clampedLevel < 0) {
        console.error('Invalid happiness level:', clampedLevel);
        return [];
    }
    return Array(clampedLevel).fill(imageUrl);
};


const CardItem = ({ card, onAddCard }) => {
    const [isHovered, setIsHovered] = useState(false);

    const hpLevel = Math.min(Math.max(card.hp || 0, 0), 100);
    const strengthLevel = Math.min((card.attacks?.length || 0) * 50, 100);
    const weaknessLevel = Math.min((card.weaknesses?.length || 0) * 100, 100);
    const damage = (card.attacks || []).reduce((total, attack) => {
        const match = attack.damage ? attack.damage.match(/\d+/) : null;
        return total + (match ? parseInt(match[0], 10) : 0);
    }, 0);
    const happinessLevel = Math.max(0, Math.round(((hpLevel / 10) + (damage / 10) + 10 - (weaknessLevel / 100)) / 5));

    console.log(happinessLevel); // For debugging 

    return (
        <div className='Cards-item'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <img src={card.imageUrl || 'https://via.placeholder.com/150'} alt={card.name || 'Pokemon'} className='Card-img' />
            <div className='Cards-detail' >
                <p>{(card.name || 'Unknown').toUpperCase()}</p>
                <div className='Cards-status'>
                    <div className='stats'>
                        <h3>HP</h3>
                        <ProgressBar value={hpLevel} max={100} />
                    </div>
                    <div className='stats'>
                        <h3>STR</h3>
                        <ProgressBar value={strengthLevel} max={100} />
                    </div>
                    <div className='stats'>
                        <h3>WEAK</h3>
                        <ProgressBar value={weaknessLevel} max={100} />
                    </div>
                </div>
                <div className='Happiness-images'>
                    {generateHappinessImages(happinessLevel, plusImageUrl).map((url, index) => (
                        <img key={index} src={url} alt={`Happiness Level ${index + 1}`} className='Happiness-image' />
                    ))}
                </div>
            </div>
            <h1 className='add-botton' style={{ display: isHovered ? 'block' : 'none' }} onClick={() => onAddCard(card)}>Add</h1>
        </div>
    );
};

const PokemonCard = ({ addedCards, onAddCard }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('http://localhost:3030/api/cards')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.cards)) {
                    const filteredCards = data.cards.filter(card =>
                        card.supertype === 'Pokémon' &&
                        !addedCards.some(addedCard => addedCard.id === card.id)
                    );
                    setCards(filteredCards);
                } else {
                    console.error('Invalid data format received.');
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching card data:', error);
                setLoading(false);
            });
    }, [addedCards]);

    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };
    const filteredCards = cards.filter(card => {
        const nameMatches = card.name.toLowerCase().includes(searchQuery);
        const typeMatches = card.types?.some(type => type.toLowerCase().includes(searchQuery)) || false;
        return nameMatches || typeMatches;
    });
    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <div className='AllCards'>
            <div className="search-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Find pokemon"
                    value={searchQuery}
                    onChange={handleSearchQueryChange}
                />
                <img src={Search} alt="Search" />
            </div>
            <div className='Cards-Con' >
                {filteredCards.map((card) => (
                    <CardItem key={card.id} card={card} onAddCard={onAddCard} />
                ))}
            </div>
        </div>
    );
};

export default PokemonCard;
