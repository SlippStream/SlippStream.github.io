"use server";
import * as http from "https";
import { prisma } from "@/util/prisma.ts";
import currentPokemon from "@/components/homeServer.tsx";
const Image = require("next/image.js");

const api_endpoint = "https://pokeapi.co/api/v2/";

export interface RawPokemon {
    id: number;
    name: string;
    types: [
        {
            slot: number;
            type: {
                name: string;
                url: string;
            }
        }
    ];
    sprites: {
        front_default: string;
    };
}

export const PokemonImage = async({...props}: {id: number}) => {
    let pk = await(getPokemonById(props.id));
    return(
        <main>
            <Image 
                src={pk.sprites.front_default}
                width={250}
                height={250}
                alt={pk.name}/>
            <h1 className="w-3/6 place-self-center">#{pk.id} - {pk.name}</h1>
        </main>
    )
}

export const getPokemonById = async (id: number): Promise<RawPokemon> => {
    return new Promise((resolve, reject) => {
        http.get(`${api_endpoint}pokemon/${id}`, res => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    reject();
                }
            })
        })
    });
}

export const getNumberOfPokemon = async (): Promise<number> => {
    return new Promise((resolve, reject) => {
        http.get(`${api_endpoint}pokemon?limit=100000&offset=0`, res => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(data).count);
            })
        })
    });
}
export const getNumberOfPokemonInDatabase = async (): Promise<number> => {
    await prisma.$connect();
    const c = prisma.pokemon.count()
    await prisma.$disconnect();
    return c;
}

export const getRandomPokemon = async (): Promise<RawPokemon> => {
    const count = await getNumberOfPokemonInDatabase();
    return await getPokemonById(Math.ceil(Math.random() * count));

}

export const updatePokemonEntries = async () => {
    const numPokemon = await getNumberOfPokemon();
    const databasePokemon = await prisma.pokemon.count();
    if (numPokemon <= databasePokemon) return;
    for (let i = 1; i <= numPokemon; i++) {
        let res = await getPokemonById(i);
        await prisma.pokemon.update({
            where: { id: i },
            data: {
                types: res.types.flatMap((p) => p.type.name)
            }
        }).catch(async () => {
            await prisma.pokemon.create({
                data: {
                    id: i,
                    name: res.name,
                    types: res.types.flatMap((p) => p.type.name)
                }
            })
        });
        console.log(`info: updated ${res.name}`);
    };
}