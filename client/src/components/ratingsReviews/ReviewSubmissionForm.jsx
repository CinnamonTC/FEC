import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import Axios from 'axios';
import ClickableStarRating from './ClickableStarRating.jsx';
import CharacteristicRow from './CharacteristicRow.jsx';
import ReviewImageUpload from './ReviewImageUpload.jsx';

function ReviewSubmissionForm({ close, characteristics, productId }) {
  const [formData, setFormData] = useState({
    product_id: productId,
    summary: '',
    photos: [],
    characteristics: {},
    body: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) =>
    setFormData((prev) => {
      const stateCopy = { ...prev };
      stateCopy[e.target.name] = e.target.value.trim();
      return stateCopy;
    });

  const onChangeInt = (e) =>
    setFormData((prev) => {
      const stateCopy = { ...prev };
      stateCopy[e.target.name] = parseInt(e.target.value, 10);
      return stateCopy;
    });

  const onChangeBool = (e) =>
    setFormData((prev) => {
      const stateCopy = { ...prev };
      stateCopy[e.target.name] = !!e.target.value;
      return stateCopy;
    });

  const onChangeCharacteristic = (e) =>
    setFormData((prev) => {
      const stateCharacteristicsCopy = { ...prev.characteristics };
      stateCharacteristicsCopy[e.target.name] = parseInt(e.target.value, 10);
      return { ...prev, characteristics: stateCharacteristicsCopy };
    });

  const addImage = (url) => {
    setFormData((prev) => {
      const photosCopy = [...prev.photos];
      photosCopy.push(url);
      return { ...prev, photos: photosCopy };
    });
  };

  const validateForm = () => {
    // Has required fields
    if (
      _.difference(
        ['rating', 'body', 'recommend', 'name', 'email', 'characteristics'],
        _.keys(formData)
      ).length > 0
    ) {
      return false;
    }

    // Required Text Fields are not blank
    if (!_.any(['body', 'name', 'email'], (val) => !!formData[val])) {
      return false;
    }

    // Email is a valid email
    if (
      formData.email.search(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) === -1
    ) {
      return false;
    }

    // Has required characteristics
    _.difference(
      _.pluck(characteristics, 'id'),
      _.keys(formData.characteristics)
    );
    if (
      _.difference(
        _.pluck(characteristics, 'id'),
        _.keys(formData.characteristics).map((val) => parseInt(val, 10))
      ).length > 0
    ) {
      return false;
    }

    // Summary, display name, and email are less than or equal to 60 characters
    if (
      formData.summary.length > 60 ||
      formData.name.length > 60 ||
      formData.email.length > 60
    ) {
      return false;
    }

    // Body is over 50 characters and less than or equal to 1000 characters
    if (formData.body.length < 50 || formData.body.length > 1000) {
      return false;
    }

    return true;
  };

  const submitForm = () => {
    Axios.post('/reviews', formData).then(() => {
      close();
    });
  };

  const required = submitted && <p className="rnr-required">Required</p>;

  return (
    <div className="rnr-submission-form-outer">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!validateForm()) {
            setSubmitted(true);
          } else {
            submitForm();
          }
        }}
        className="rnr-submission-form"
      >
        <div className="flex-between">
          <div>
            <ClickableStarRating onChange={onChangeInt} />
            {!formData.rating && required}
          </div>
          <button className="review-list-button" type="button" onClick={close}>
            Close
          </button>
        </div>
        <div>
          <h6>Would you recommend this product?</h6>
          <label htmlFor="recommend-yes">
            <input
              type="radio"
              name="recommend"
              id="recommend-yes"
              value="yes"
              onChange={onChangeBool}
            />
            yes
          </label>
          <label htmlFor="recommend-no">
            <input
              type="radio"
              name="recommend"
              id="recommend-no"
              value=""
              onChange={onChangeBool}
            />
            no
          </label>
          {formData.recommend === undefined && required}
        </div>
        <hr />
        <div className="rnr-characteristic-rows">
          {_.map(characteristics, (char, key) => (
            <CharacteristicRow
              characteristic={key}
              characteristicId={char.id}
              onSelection={onChangeCharacteristic}
              required={!formData.characteristics[char.id] && required}
              key={char.id}
            />
          ))}
        </div>
        <hr />
        <label htmlFor="review-summary">
          <h6>Review Summary</h6>
          <textarea
            id="review-summary"
            name="summary"
            placeholder="Example: Best purchase ever!"
            onChange={onChange}
          />
        </label>
        <label htmlFor="review-body">
          <h6>Review body</h6>
          <textarea
            id="review-body"
            name="body"
            onChange={onChange}
            placeholder="Why did you like the product or not?"
            rows="5"
          />
          {formData.body.length < 50 ? (
            <p
              style={{ color: submitted ? 'red' : 'inherit' }}
            >{`Minimum required characters left: ${
              50 - formData.body.length
            }`}</p>
          ) : (
            <p>{'Minimum reached'}</p>
          )}
        </label>
        <hr />
        <h6>Images</h6>
        <div>
          {formData.photos.map((url) => (
            <div className="img-container" key={url}>
              <img src={url} alt="User uploaded" />
            </div>
          ))}
        </div>
        {formData.photos.length < 5 && (
          <ReviewImageUpload addImage={addImage} />
        )}
        <hr />
        <label htmlFor="review-nickname">
          <h6>Display name</h6>
          <input
            type="text"
            id="review-nickname"
            placeholder="Example: jackson11!"
            name="name"
            onChange={onChange}
          />
          For privacy reasons, do not use your full name or email address.
          {!formData.name && required}
        </label>
        <label htmlFor="review-email">
          <h6>Email</h6>
          <input
            type="text"
            id="review-email"
            placeholder="Example: jackson11@email.com"
            name="email"
            onChange={onChange}
          />
          For authentication reasons, you will not be emailed.
          {!formData.email && required}
        </label>
        <button className="review-list-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

ReviewSubmissionForm.propTypes = {
  close: PropTypes.func.isRequired,
  characteristics: PropTypes.object,
  productId: PropTypes.number,
};

ReviewSubmissionForm.defaultProps = {
  characteristics: {},
  productId: undefined,
};

export default ReviewSubmissionForm;
