/* eslint-disable import/extensions */
/* eslint-disable no-unused-vars */
import React from 'react';
import axios from 'axios';
import Search from './Search.jsx';
import Questions from './Questions.jsx';

const { useState, useEffect } = React;

function Qna(props) {
  const [search, setSearch] = useState('');
  const [questions, setQuestions] = useState([]);
  // Using lines 16-19 for testing in-develpment.
  // Line 15 will be used during implementation to set state after development is finished
  // const { product } = props;
  const product = {
    "id": 40346,
};
  const productId = product.id;

  useEffect(() => {
    const queryParams = {
      params: {
        product_id: productId,
        page: 10,
        count: 5,
      },
    };
    axios.get('/qa/questions', queryParams)
      .then((response) => setQuestions(response.data.results));
  }, []);

  const handleSearch = (searchEntry) => {
    // TODO flesh out handleSearch;
    console.log(searchEntry);
  };

  return (
    <div>
      <h1
        className="qna-title"
      >
        QUESTIONS &amp; ANSWERS
      </h1>
      <Search
        className="qnaSearch"
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />
      <Questions
        className="qnaAccordion"
        product={props}
        questions={questions}
      />
      <button
        className="moreQs"
        type="button"
      >
        MORE ANSWERED QUESTIONS
      </button>
      <button
        className="addQs"
        type="button"
      >
        ADD A QUESTION  +
      </button>
    </div>
  );
}

export default Qna;