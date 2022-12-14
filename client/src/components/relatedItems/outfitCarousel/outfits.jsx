import React, { useState, useEffect } from 'react';
import OutfitCard from './outfitCard.jsx';

function Outfits({ product }) {
  const storage = JSON.parse(localStorage.getItem('outfits')) || [];
  const [outfits, setOutfits] = useState(storage);

  useEffect(() => {
    localStorage.setItem('outfits', JSON.stringify(outfits));
  }, [outfits]);

  const handleAddOutfit = () => {
    for (let i = 0; i < outfits.length; i++) {
      if (outfits[i].id === product.id) {
        return;
      }
    }
    setOutfits([...outfits, product]);
  };

  const handleDeleteOutfit = (selectedId) => {
    localStorage.clear();
    const newOutfit = outfits.filter((outfit) => outfit.id !== selectedId);
    setOutfits(newOutfit);
  };

  return (
    <div className="outfit-carousel">
      <div className="add-outfit" onClick={handleAddOutfit}>
        <h1 className="add-outfit-text">&#10090; + &#10091;</h1>
        <h1 className="add-outfit-text">Add to Outfit</h1>
      </div>
      <div className="inner-outfit-box">
        {
          outfits ?
            outfits.map((outfit) => (
              <OutfitCard outfit={outfit} handleDeleteOutfit={handleDeleteOutfit} key={outfit.id} />
            ))
            : null
          }
      </div>
    </div>
  );
}

export default Outfits;
