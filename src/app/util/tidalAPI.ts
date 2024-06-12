import 'dotenv/config'
import { TidalTrack } from "@/components/tidalServer";
import * as auth from "@tidal-music/auth";
import * as http from "https";


export let tidal: TidalAPI;
const api_endpoint = "openapi.tidal.com"

export type TidalResult = {
    tracks: {
        resource: {
            id: number,
            tidalUrl: string,
            title: string,
            album: {
                imageCover: {
                    url: string,
                    width: number,
                    height: number
                }[],
                title: string
            },
            artists: {
                name: string
            }[]
        }
    }[]
}

export class TidalAPI {
    token: string;
    headers: any;

    constructor(token: string) {
        this.token = token;
    }

    async getSearchResults(query: string): Promise<TidalResult> {
        return new Promise((resolve, reject) => {
            http.request({
                headers: {
                    "Authentication": `Bearer ${this.token}`,
                    "query": `${query}`,
                    "countryCode": "US",
                    "limit": 10
                },
                href: `${api_endpoint}`,
                path: `/search`,
                method: 'GET'
            },
            (res) => {
                let data = '';
                res.on('data', chunk=> { data += chunk; })
                res.on('end', () => {
                    try {
                        console.log(data);
                        resolve(JSON.parse(data));
                    }
                     catch(e) {console.error(e); reject()}
                });
            });
        });
    }
    static async initTidal(clientId: string, clientSecret: string) {
        if (!globalThis.localStorage) globalThis.localStorage = window.localStorage;
        if (window) console.log("we have a window!");
        await auth.init(
            {
                clientId,
                clientSecret,
                scopes: [],
                credentialsStorageKey: "key"
            }
        ).catch(e => console.error(`initTidal: ${e}`))
        await auth.credentialsProvider.getCredentials()
            .then((credentials) => {
                console.log(credentials.token);
                if (credentials.token) tidal = new TidalAPI(credentials.token);
            })
            .catch(e => console.error(`initTidal: ${e}`));
    }
}

