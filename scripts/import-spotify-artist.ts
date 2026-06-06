#!/usr/bin/env tsx
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import {
  buildSpotifyImportReport,
  fetchSpotifyArtistImport,
  getSpotifyAccessToken,
  normalizeSpotifyArtistImport,
  type SpotifyArtistImportPayload,
} from '../src/lib/spotify';

type CliArgs = {
  artistSlug: string;
  spotifyArtist: string;
  fixture?: string;
};

function parseArgs(argv: string[]): CliArgs {
  const args = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const value = argv[index + 1];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${token}`);
    args.set(token.slice(2), value);
    index += 1;
  }

  const artistSlug = args.get('artist-slug');
  const spotifyArtist = args.get('spotify-artist') ?? args.get('spotify-artist-id') ?? 'fixture';
  if (!artistSlug) throw new Error('Usage: tsx scripts/import-spotify-artist.ts --artist-slug seo2 --spotify-artist <id|uri|url> [--fixture path.json]');

  return { artistSlug, spotifyArtist, fixture: args.get('fixture') };
}

async function loadPayload(args: CliArgs): Promise<SpotifyArtistImportPayload> {
  if (args.fixture) {
    const fixturePath = resolve(process.cwd(), args.fixture);
    return JSON.parse(await readFile(fixturePath, 'utf8')) as SpotifyArtistImportPayload;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Missing SPOTIFY_CLIENT_ID/SPOTIFY_CLIENT_SECRET. Use --fixture for an offline dry run.');
  }

  const token = await getSpotifyAccessToken({ clientId, clientSecret });
  return fetchSpotifyArtistImport(args.spotifyArtist, token);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const payload = await loadPayload(args);
  const normalized = normalizeSpotifyArtistImport(payload);
  const report = buildSpotifyImportReport(args.artistSlug, normalized);

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Spotify importer failed: ${message}\n`);
  process.exit(1);
});
