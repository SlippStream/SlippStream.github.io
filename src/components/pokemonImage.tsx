"use client";
import { getPokemonById, RawPokemon } from "@/app/util/pokemonAPI.tsx";
import { useEffect, useLayoutEffect, useRef } from "react";
const Image = require("next/image.js");

export default async function PokemonImage ({...props}: {id: number})  {
    let pk: RawPokemon | undefined = undefined;
    useDidUpdateEffect(() => {
        (async() => {
            pk = await getPokemonById(props.id);
        })()
    });
    if (!pk) return;
    return(
        <main>
            <Image 
                src={(pk as RawPokemon).sprites.front_default}
                width={250}
                height={250}
                alt={(pk as RawPokemon).name}/>
            <h1 className="w-3/6 place-self-center">#{(pk as RawPokemon).id} - {(pk as RawPokemon).name}</h1>
        </main>
    )
}

function useDidUpdateEffect(fn: Function, inputs?: any) {
    const isMountingRef = useRef(false);
  
    useEffect(() => {
      isMountingRef.current = true;
    }, []);
  
    useEffect(() => {
      if (!isMountingRef.current) {
        return fn();
      } else {
        isMountingRef.current = false;
      }
    }, inputs);
  }