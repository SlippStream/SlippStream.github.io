"use server";
import 'dotenv/config'
import { TidalSearch } from "@/components/tidalSearch.tsx";
import { prisma } from "@/util/prisma.ts";
import React from "react";
import { PokemonProfile } from "@/components/homeServer.tsx";
import { getRandomPokemon } from "@/util/pokemonAPI.tsx";
async function main() {
  await prisma.$connect();
}

main()
  .then(async() => {
    prisma.$disconnect();
  })
  .catch(async(e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  })

export default async function Home() {
  return (
    <main>
      <PokemonProfile firstPokemonID={1}/>
      <TidalSearch clientId={process.env.TIDAL_CLIENT_ID as string} clientSecret={ process.env.TIDAL_CLIENT_SECRET as string}/>
    </main>
  );
}
