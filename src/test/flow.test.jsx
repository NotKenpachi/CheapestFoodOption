import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import App from '../App.jsx';

const click = (el) => fireEvent.click(el);
const priceOf = (card) => Number(within(card).getByTestId('card-price').textContent.replace('$', ''));

describe('full demo journey', () => {
  it('search → hangout → vote → order → confirm, with live totals vs the cheapest estimate', async () => {
    render(<App />);

    // 1. Location
    click(screen.getByRole('button', { name: /allow location access/i }));
    await screen.findByRole('heading', { name: /what are you hungry for/i });

    // 2. Choose food → cheapest restaurants
    click(screen.getByRole('button', { name: /^pizza/i }));
    const cards = await screen.findAllByTestId('restaurant-card');
    expect(cards.length).toBeGreaterThan(1);
    expect(within(cards[0]).getByText(/cheapest nearby/i)).toBeTruthy();
    const prices = cards.map(priceOf);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);

    // Filters work
    click(screen.getByRole('button', { name: /filters/i }));
    click(screen.getByRole('button', { name: 'Delivery' }));
    click(screen.getByRole('button', { name: /show results/i }));
    const filtered = await screen.findAllByTestId('restaurant-card');
    expect(filtered.length).toBeLessThan(cards.length);
    click(screen.getByRole('button', { name: /filters/i }));
    click(screen.getByRole('button', { name: /reset/i }));
    click(screen.getByRole('button', { name: /show results/i }));
    const again = await screen.findAllByTestId('restaurant-card');

    // 3. Select restaurant → start hangout
    click(again[0]);
    click(await screen.findByRole('button', { name: /start a hangout/i }));
    click(screen.getByRole('button', { name: /invite alex chen/i }));
    click(screen.getByRole('button', { name: /invite sam okafor/i }));
    click(screen.getByRole('button', { name: /invite jordan reyes/i }));
    click(screen.getByRole('button', { name: /find cheap spots for 4 people/i }));

    // 4. Vote on 2–3 options, votes update live
    const options = await screen.findAllByTestId('vote-option');
    expect(options.length).toBeGreaterThanOrEqual(2);
    expect(options.length).toBeLessThanOrEqual(3);
    expect(screen.getByTestId('vote-progress').textContent).toMatch(/3 friends invited · 0\/4 voted/);
    click(options[0]);
    expect(screen.getByTestId('vote-progress').textContent).toMatch(/1\/4 voted/);
    await waitFor(() => expect(screen.getByTestId('vote-progress').textContent).toMatch(/4\/4 voted/));

    // 5. Winner (auto-finalized once everyone voted)
    const winner = await screen.findByTestId('winner-name', {}, { timeout: 3000 });
    const winnerName = winner.textContent;
    click(screen.getByRole('button', { name: /order for the group \(4\)/i }));

    // 6. Order from the winner; totals update
    await screen.findByText(winnerName, { selector: '.topbar-title span' });
    expect(screen.getByRole('button', { name: /add an item to continue/i }).disabled).toBe(true);
    const plusButtons = screen.getAllByRole('button', { name: /^add one /i }).filter((b) => b.getAttribute('aria-label') !== 'Add one person');
    click(plusButtons[0]);
    click(plusButtons[0]);
    const total1 = screen.getByTestId('running-total').textContent;
    click(plusButtons[1]);
    const total2 = screen.getByTestId('running-total').textContent;
    expect(total2).not.toBe(total1);
    expect(screen.getByTestId('difference').textContent).not.toBe('—');

    // Changing fulfillment changes the total when fees apply
    const delivery = screen.getByRole('radio', { name: /delivery/i });
    if (!delivery.disabled) {
      click(delivery);
      expect(screen.getByTestId('running-total').textContent).not.toBe(total2);
    }

    // 7. Checkout and confirm, final cost compared with the estimate
    click(screen.getByRole('button', { name: /review order/i }));
    await screen.findByTestId('checkout-total');
    click(screen.getByRole('button', { name: /^confirm /i }));
    await screen.findByText(/confirmed/i);
    expect(screen.getByTestId('final-difference').textContent).toMatch(/\$\d+\.\d{2}/);
    expect(screen.getByText(winnerName)).toBeTruthy();

    click(screen.getByRole('button', { name: /start a new search/i }));
    await screen.findByRole('heading', { name: /what are you hungry for/i });
  });
});
