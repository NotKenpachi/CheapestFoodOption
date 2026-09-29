import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
import { config } from '../services/config.js';

// Make the mock services respond fast in tests.
config.latencyMs = 0;
config.voteDelaysMs = [20, 40, 60, 80, 100, 120];

afterEach(() => cleanup());
