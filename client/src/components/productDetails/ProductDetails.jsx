import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductInformation from './ProductInformation.jsx';
import StyleSelector from './StyleSelector.jsx';
import ProductImages from './ProductImages.jsx';
import SocialMedia from './SocialMedia.jsx';
import ProductSelectors from './ProductSelectors.jsx';

function ProductDetails({ product }) {
  const [reviews, setReviews] = useState([]);
  const [styles, setStyles] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState({});

  useEffect(() => {
    axios.get(`/products/${product.id}/styles`).then(({ data }) => {
      setStyles(data.results);
      setSelectedStyle(data.results[0]);
      axios
        .get(`/reviews/meta?product_id=${data.product_id}`)
        .then((response) => {
          setReviews(response.data.ratings);
        });
    });
  }, [product]);

  return (
    <div className="product-details-container">
      <div className="product-details-row">
        <div className="product-image-column">
          <ProductImages selectedStyle={selectedStyle} />
        </div>
        <div className="product-info-column">
          <ProductInformation
            product={product}
            reviews={reviews}
            selectedStyle={selectedStyle}
          />
          <StyleSelector
            styles={styles}
            setStyles={setStyles}
            setSelectedStyle={setSelectedStyle}
            selectedStyle={selectedStyle}
          />
          <ProductSelectors selectedStyle={selectedStyle} />
          {selectedStyle ? (
            selectedStyle.photos ? (
              <SocialMedia
                product={product}
                photo={selectedStyle.photos[0].url}
              />
            ) : null
          ) : null}
        </div>
      </div>
      <div className="product-details-row">
        <div className="product-overview">
          <div className="product-overview-left">
            <p id="product-slogan">{product.slogan}</p>
            <p id="product-description">{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
