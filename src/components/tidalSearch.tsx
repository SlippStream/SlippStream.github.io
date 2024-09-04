"use client";
import 'dotenv/config'
import { TidalTrack, TidalAPI, SearchComponentInternal } from '@/util/tidalAPI.tsx';
import tidal from '@/util/tidalAPI.tsx';
import { TidalList } from './tidalList.tsx';
import currentPokemon from './homeServer.tsx';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';

export type TidalState = {
    query: string;
    list: TidalTrack[];
}

export function FormSubmit(previousState: TidalState, formData: FormData): Promise<TidalState> {
    //TODO: have this update the query?
    return new Promise<TidalState>((resolve, reject): void => {
        const query = formData.get("query");
        if (query === null || query?.valueOf() as string === "") return ;
        if (!tidal) {
            reject("FormSubmit: error: TIDAL api not initialized!");
        }

        useEffect(() => {
            (async() => {
                resolve(await asyncQuery());
            })
        }, []);

        const asyncQuery = async(): Promise<TidalState> => {
            console.log(`FormSubmit: info: form submitted with query ${query?.valueOf() as string}`);
            let q: TidalTrack[] = [];

            const res = await tidal?.getSearchResults(query?.valueOf() as string);
            console.log(`FormSubmit: info: search returned ${res}.`);
            if (res) q = res as TidalTrack[];

            return {
                query: previousState.query,
                list: q
            };
        }
    });
}
 
export function TidalSearch({ clientId, clientSecret }: {clientId: string, clientSecret: string}) { 
    const [state, formAction] = useFormState<TidalState, FormData>(FormSubmit, {
        query: "",
        list: []
    });
    /*
    TidalAPI.initTidal(globalThis, clientId as string, clientSecret as string)
        .catch((e) => console.error(e))
    */
    return (
        <main>
            <form method="POST" id="song-search">
                <input form="song-search" name="query" type="text"></input>
                <input type="hidden" name="pokemon" value={currentPokemon.id}></input>
                <TidalList state={state}/>
                <button type="submit" formAction={formAction}>Submit</button>
            </form>
            <SearchComponentInternal
                clientId={clientId}
                clientSecret={clientSecret}
                />
        </main>
    )
}

export function ClientSearchComponent({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <main>
            {children}
        </main>
    )
}