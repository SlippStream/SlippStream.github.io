"use server";
import * as http from "https";
import { prisma } from "@/util/prisma.ts";
import React from "react";
import PokemonImage from "@/components/pokemonImage.tsx";

const Image = require("next/image.js");
const api_endpoint = "https://pokeapi.co/api/v2/";

let currentPk : RawPokemon;
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

const BlankPokemon: RawPokemon = {
    id: 0,
    name: "",
    types: [
        {
            slot: 0,
            type: {
                name: "",
                url: ""
            }
        }
    ],
    sprites: {
        front_default: ""
    }
}

export default async function PokemonServerComponent({...props}: {id: number}) {
    return (
        <main>
            <PokemonImage id={props.id}></PokemonImage>
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