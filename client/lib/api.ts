import { Profile, SwipeAction, SwipeResponse, MatchProfile } from './types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function fetchFeed(): Promise<Profile[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/feed`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new ApiError(data.error || `Failed to fetch feed (${res.status})`, res.status);
    }

    const data = await res.json();
    return data.profiles || [];
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err.message || 'Network connection failed. Please ensure backend server is running.'
    );
  }
}

export async function submitSwipe(
  profileId: string,
  action: SwipeAction
): Promise<SwipeResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/swipe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ profileId, action }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new ApiError(data.error || `Failed to record swipe (${res.status})`, res.status);
    }

    return await res.json();
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err.message || 'Failed to submit swipe. Please check server connection.'
    );
  }
}

export async function fetchMatches(): Promise<MatchProfile[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/matches`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new ApiError(data.error || `Failed to fetch matches (${res.status})`, res.status);
    }

    const data = await res.json();
    return data.matches || [];
  } catch (err: any) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      err.message || 'Network error while fetching matches.'
    );
  }
}

