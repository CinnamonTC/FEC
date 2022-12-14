import React from 'react';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RatingBreakdownRow from '../RatingBreakdownRow.jsx';

jest.mock('../RatingDistributionBar.jsx', () => () => (
  <div data-testid="rating-distribution-bar" />
));

afterEach(cleanup);

describe('Rating Breakdown Row', () => {
  it("Should contain a button, a rating distribution bar, and a <p> element who's text is equal the count of ratings for that rating", () => {
    userEvent.setup();
    const { getByRole, getByText, getByTestId } = render(
      <RatingBreakdownRow
        rating="2"
        ratingCount={20}
        totalRatingCount={40}
        toggleFilter={() => {}}
      />
    );

    const button = getByRole('button');
    const RatingBar = getByTestId('rating-distribution-bar');
    const p = getByText('20');

    expect(button).toBeInTheDocument();
    expect(RatingBar).toBeInTheDocument();
    expect(p).toBeInTheDocument();
  });

  it("Should have a button who's text is equal to the rating", () => {
    userEvent.setup();
    const { getByRole } = render(
      <RatingBreakdownRow
        rating="2"
        ratingCount={20}
        totalRatingCount={40}
        toggleFilter={() => {}}
      />
    );

    const button = getByRole('button');

    expect(button).toHaveTextContent('2 stars');
  });

  it('Should have a button that calls the addFilter function when clicked', (done) => {
    const filters = [];
    const addFilter = (value) => {
      filters.push(value);
    };

    userEvent.setup();
    const { getByRole } = render(
      <RatingBreakdownRow
        rating="2"
        ratingCount={20}
        totalRatingCount={40}
        toggleFilter={addFilter}
      />
    );

    const button = getByRole('button');

    userEvent.click(button).then(() => {
      expect(filters.length > 0).toBe(true);
      done();
    });
  });
});
