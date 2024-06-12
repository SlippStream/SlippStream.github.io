"use client";
import React from "react";
import Image from "next/image";
import { RawPokemon, getPokemonById, getRandomPokemon } from "@/app/util/pokemonAPI";
import { Pokemon } from "@prisma/client";

let currentPokemon: Pokemon = {
    id: 0,
    name: "NONE",
    types: []
};

export function PokemonProfile({ firstPokemon }: {firstPokemon: RawPokemon}) {
    const [pokemon, setPokemon] = React.useState(firstPokemon);
    currentPokemon = {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types.flatMap((v) => v.type.name)
    }
    return (
        <main>
            <Image 
            src={pokemon.sprites.front_default}
            width={250}
            height={250}
            alt={pokemon.name}/>
            <h1 className="w-3/6 place-self-center">#{pokemon.id} - {pokemon.name}</h1>
            <button onClick={() => getRandomPokemon().then((pk) => setPokemon(pk))}>Get Random Pokemon</button>
            <br></br>
            <form onSubmit={(e) => {
                e.preventDefault();
                getPokemonById(e.currentTarget.id_enter.value as number)
                .then((pk) => setPokemon(pk));
            }}>
                <input name="id_enter" type="number" defaultValue="1"/>
            </form>
        </main>
    )
}

export default currentPokemon;