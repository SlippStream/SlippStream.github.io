"use client";
const Image = require("next/image.js");
import { useState } from "react";
import { PokemonImage, RawPokemon, getPokemonById, getRandomPokemon } from "@/util/pokemonAPI.tsx";
import { Pokemon } from "@prisma/client";

let currentPokemon: RawPokemon = {
    id: 0,
    name: "",
    sprites: {
        front_default: ""
    },
    types: [
        {
            slot: 0,
            type: {
                name: "",
                url: ""
            }
        }
    ]
};

export function PokemonProfile({ firstPokemonID }: {firstPokemonID: number}) {
    const [pokemonId, setPokemonId] = useState(firstPokemonID);
    return (
        <main>
            <PokemonImage
                id={pokemonId}/>
            <button onClick={() => getRandomPokemon().then((pk) => setPokemonId(pk.id))}>Get Random Pokemon</button>
            <br></br>
            <form onSubmit={(e) => {
                e.preventDefault();
                getPokemonById(e.currentTarget.id_enter.value as number)
                .then((pk) => setPokemonId(pk.id));
            }}>
                <input name="id_enter" type="number" defaultValue="1"/>
            </form>
        </main>
    )
}

export default currentPokemon;