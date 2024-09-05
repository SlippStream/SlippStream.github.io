"use client";
import React, { useState } from "react";
import { default as PokemonServerComponent, RawPokemon, getPokemonById, getRandomPokemon } from "@/util/pokemonAPI.tsx";

export let currentPokemon: RawPokemon = {
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
            <PokemonServerComponent id={pokemonId}/>
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