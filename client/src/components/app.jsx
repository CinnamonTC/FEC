import React from 'react';
import axios from 'axios';
import ProductDetails from './productDetails/ProductDetails.jsx';
import QnaWidget from './questionsAnswers/A-QnaWidget.jsx';
import Rnr from './ratingsReviews/RatingReviewContainer.jsx';
import RelatedItems from './relatedItems/container.jsx';

const { useState, useEffect } = React;

function App() {
  const [product, setProduct] = useState({});
  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    axios.get('/products').then(({ data }) => {
      setProduct(data[0]);
    });
  }, []);

  return (
    <div>
      <div className="title-container">
        <h1 className="title">Cinnamon</h1>
        <div className="title-icons">
          <span className="material-symbols-outlined">search</span>
          <span className="material-symbols-outlined">shopping_bag</span>
        </div>
      </div>
      <div className="widgets">
        <ProductDetails product={product} />
        <RelatedItems product={product} setProduct={setProduct} />
        <QnaWidget product={product} />
        <Rnr product={product} />
      </div>
    </div>
  );
}

export default App;
