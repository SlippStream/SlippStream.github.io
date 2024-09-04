import 'dotenv/config'
import * as auth from "@tidal-music/auth";
import { Song } from '@prisma/client';
import { Tidal } from "./tidal.js";
import { createSearchClient } from "@tidal-music/search";
import { ClientSearchComponent, TidalSearch } from '@/components/tidalSearch.tsx';

let searchClient: any;
let tidal: TidalAPI | undefined;
export const tidalId = process.env.TIDAL_CLIENT_ID;
export const tidalSecret = process.env.TIDAL_CLIENT_SECRET;

export interface TidalTrack extends Song {
    albumCover: string;
    artist: string;
    title: string;
    albumName: string;
}

export type TidalResultInternal = {
    tracks: TidalTrack[]
}

export type TidalProps = {
    window: Window | any;
    clientId: string,
    clientSecret: string
};

export class TidalAPI {
    token: string;
    headers: any;

    constructor(token: string) {
        this.token = token;
    }

    async getSearchResults(query: string): Promise<TidalTrack[] | undefined> {
        if (!searchClient) {
            searchClient = createSearchClient(auth.credentialsProvider);
        }
        console.log(`getSearchResults: info: beginning search with query \"${query}\"`);
        const { data, error } = await searchClient.GET(`/searchresults/${query}/relationships/tracks`,
            {
                params: {
                    path: { query },
                    query: { countryCode: 'US', limit: 15, include: "tracks" }
                }
            }
        );

        if (error) {
            error.errors.forEach((err: any) => console.error(`getSearchResults: error: ${err}`));
            return undefined;
        }

        const res: TidalTrack[] = [];
        (data as Tidal.SearchResultsRelationshipsDocument).included.forEach(async (val) => {
            const artistLink = val.relationships.artists?.links.self;
            const albumLink = val.relationships.albums?.links.self;
            const { artist, e0 } = await searchClient.GET(artistLink,
                {
                    params: {
                        query: { countryCode: 'US', limit: 10, include: "artists" }
                    }
                }
            );
            if (e0) {
                console.error(e0);
                return;
            }
            const { album, e1 } = await searchClient.GET(albumLink,
                {
                    params: {
                        query: { countryCode: 'US', limit: 1, include: "albums" }
                    }
                }
            );
            if (e1) {
                console.error(e1);
                return;
            }
            res.push({
                albumCover: ((album as Tidal.SearchResultsRelationshipsDocument).included[0].attributes as Tidal.AlbumAttributes).imageLinks[0].href,
                artist: ((artist as Tidal.SearchResultsRelationshipsDocument).included[0].attributes as Tidal.ArtistAttributes).name,
                title: (val.attributes as Tidal.TrackAttributes).title,
                albumName: ((album as Tidal.SearchResultsRelationshipsDocument).included[0].attributes as Tidal.AlbumAttributes).title,
                tidalId: Number(val.id),
                tidalUrl: val.links.self
            });
        });
        return res;
    }

    static async initTidal({...props}: TidalProps) {
        if (!props.window) {
            setTimeout(this.initTidal, 5000, props.clientId, props.clientSecret);
            return;
        }
        if (!globalThis.localStorage) globalThis.localStorage = props.window.localStorage;
        await auth.init(
            {
                clientId: props.clientId,
                clientSecret: props.clientSecret,
                scopes: [],
                credentialsStorageKey: "key"
            }
        ).catch(e => console.error(`initTidal: ${e}`))
        await auth.credentialsProvider.getCredentials()
            .then((credentials) => {
                if (credentials.token) {
                    tidal = new TidalAPI(credentials.token);
                    searchClient = createSearchClient(auth.credentialsProvider);
                }
            })
            .catch(e => console.error(`initTidal: ${e}`));
        return (
            <main>

            </main>
        )
    }
}

export async function SearchComponentInternal({...props}: {clientId: string, clientSecret: string}) {
    return (
        <ClientSearchComponent>
            <TidalAPI.initTidal
                        window ={globalThis}
                        clientId={props.clientId}
                        clientSecret={props.clientSecret}
                        />
        </ClientSearchComponent>
    )
}

export default tidal;