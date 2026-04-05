import React from 'react';

export type RoleId = 'artist' | 'manager' | 'marketing' | 'legal' | 'analytics' | 'admin';
export type View = 'gateway' | 'dashboard' | 'management' | 'marketing' | 'audit' | 'analytics' | 'admin';
export type AccessResult = 'ALLOWED' | 'DENIED' | 'EMBARGOED';

export interface AuditEntry {
  id: string;
  timestamp: string;
  roleId: RoleId | 'system' | 'superuser';
  roleLabel: string;
  action: string;
  resource: string;
  result: AccessResult | 'EXECUTED' | 'VERIFIED';
  model: string;
  reason?: string;
  
  // Keep these for backward compatibility with initial dummy data if needed, or replace.
  user?: string;
  initials?: string;
}

export interface Artist {
  id: string;
  name: string;
  distribution: string;
  internalId: string;
  image: string;
  managerId?: string;
  artistId?: string;
}

export interface Track {
  title: string;
  releaseDate: string;
  plays: string;
  status: 'LIVE' | 'EMBARGOED' | 'PRE-CLEARED' | 'PENDING OPS';
  artist?: string;
}

export const ARTISTS: Artist[] = [
  {
    id: '1',
    name: 'Rosalía',
    distribution: 'Global Premium',
    internalId: 'RS-904',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    managerId: 'manager',
    artistId: 'artist-1'
  },
  {
    id: '2',
    name: 'Bad Bunny',
    distribution: 'Exclusive Tier 1',
    internalId: 'BB-001',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    managerId: 'manager',
    artistId: 'artist-2'
  },
  {
    id: '3',
    name: 'J Balvin',
    distribution: 'Multi-territory',
    internalId: 'JB-112',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    managerId: 'manager2',
    artistId: 'artist-3'
  }
];

export const TRACKS: Track[] = [
  { title: 'Neon Horizon', releaseDate: '12 Jan 2024', plays: '1,240,582', status: 'LIVE', artist: 'artist-1' },
  { title: 'Midnight Circuit', releaseDate: '05 Dec 2023', plays: '892,104', status: 'LIVE', artist: 'artist-1' },
  { title: 'Digital Echoes', releaseDate: '18 Nov 2023', plays: '450,229', status: 'LIVE', artist: 'artist-2' },
  { title: 'Quartz Reverie', releaseDate: '02 Oct 2023', plays: '2,105,883', status: 'LIVE', artist: 'artist-2' }
];

export const RELEASES = [
  { title: 'Midnight Echoes', status: 'EMBARGOED', artist: 'Luna Vane', date: 'Oct 25, 2024', img: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=200&h=200&fit=crop', color: 'bg-orange-100 text-orange-700' },
  { title: 'Neon Horizon', status: 'PRE-CLEARED', artist: 'Circuit Pulse', date: 'Nov 02, 2024', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&h=200&fit=crop', color: 'bg-emerald-100 text-emerald-700' },
  { title: 'Silent Waves', status: 'EMBARGOED', artist: 'Ghost Freq', date: 'Nov 15, 2024', img: 'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=200&h=200&fit=crop', color: 'bg-orange-100 text-orange-700' },
];

export const EMPLOYEES = [
  { id: '1', name: 'Carlos Mendoza', role: 'Coordinador de distribución', salary: '$3,200,000 COP' },
  { id: '2', name: 'Andrea Torres', role: 'Analista financiero', salary: '$4,100,000 COP' },
  { id: '3', name: 'Felipe Ruiz', role: 'Soporte técnico', salary: '$2,800,000 COP' },
];

export const AUDIT_LOGS: AuditEntry[] = [
  {
    id: 'mock-1',
    timestamp: '2023-10-27 14:22:01',
    roleId: 'artist',
    roleLabel: 'Artist',
    action: 'Artist granted DAC to accountant',
    resource: '0x4F...E821',
    result: 'ALLOWED',
    model: 'DAC',
    reason: 'Artist can share dashboard'
  },
  {
    id: 'mock-2',
    timestamp: '2023-10-27 14:18:32',
    roleId: 'manager',
    roleLabel: 'Manager',
    action: 'Manager blocked from Rival Financials',
    resource: 'FIN_REPORTS_23',
    result: 'DENIED',
    model: 'RBAC',
    reason: 'Cannot view unrepresented artists'
  }
];
