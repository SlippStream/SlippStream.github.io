import * as http from "https";
import { prisma } from "../page";
import { Pokemon } from "@prisma/client";

const api_endpoint = "https://pokeapi.co/api/v2/";

interface RawPokemon {
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

export const getNumberOfPokemon = async(): Promise<number> => {
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

export const getRandomPokemon = async(): Promise<RawPokemon> => {
    const count = await getNumberOfPokemon();
  return await getPokemonById(Math.ceil(Math.random() * count));
  
}

export const updatePokemonEntries = async() => {
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