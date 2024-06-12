"use client";
import 'dotenv/config'
import { TidalAPI, TidalResult, tidal } from '@/app/util/tidalAPI';
import { TidalList } from './tidalList';
import { TidalTrack, tidalId, tidalSecret } from './tidalServer';
import { useEffect } from 'react';
import currentPokemon from './homeServer';
import { useFormState } from 'react-dom';
import { Pokemon, Song } from '@prisma/client';

export type TidalState = {
    query: string;
    list: TidalTrack[];
}

export function parse(res: TidalResult): TidalTrack[] {
    const tracks: TidalTrack[] = [];
    res.tracks.forEach((v, i, a) => {
        tracks.push({
            albumCover: v.resource.album.imageCover[0].url,
            albumName: v.resource.album.title,
            artist: v.resource.artists[0].name,
            tidalId: v.resource.id,
            tidalUrl: v.resource.tidalUrl,
            title: v.resource.title
        });
    });
    return tracks;
}

async function FormSubmit(previousState: TidalState): Promise<TidalState> {
    //TODO: have this update the query?
    const q = 
    return {
        query: previousState.query,
        list: parse(await tidal.getSearchResults(previousState.query))
    }
}
 
export function TidalSearch({ clientId, clientSecret }: {clientId: string, clientSecret: string}) { 
    const [state, formAction] = useFormState<TidalState>(FormSubmit, {
        query: "",
        list: []
    });
    console.log(`borgingo: ${clientId}`);
    useEffect(() => {
        TidalAPI.initTidal(clientId as string, clientSecret as string);
    });
    return (
        <main>
            <form method="POST" id="song-search">
                <input form="song-search" name="query" type="text"></input>
                <input type="hidden" name="pokemon" value={currentPokemon.id}></input>
                <TidalList state={state}/>
                <button type="submit" formAction={formAction}></button>
            </form>
        </main>
    )
}
