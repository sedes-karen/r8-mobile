import { LabelProfile, LabelProfileImageResponse } from '../../types/label';

const API_BASE = 'https://api.example.com';

export async function getLabelMe(): Promise<LabelProfile> {

  const res = await fetch(`${API_BASE}/labels/me`, { headers: { 'Content-Type': 'application/json' } });

  if (!res.ok) throw new Error('Error fetching label');

  return res.json();
}

export async function getLabelProfileImage(): Promise<LabelProfileImageResponse | null> {
  const res = await fetch(`${API_BASE}/labels/me/profile-image`, { headers: { 'Content-Type': 'application/json' } });

  if (!res.ok) return null;
  
  return res.json();
}
