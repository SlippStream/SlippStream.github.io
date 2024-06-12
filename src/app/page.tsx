"use server";
import 'dotenv/config'
import { TidalSearch } from "../components/tidalSearch";
import { prisma } from "./util/prisma";
import React from "react";
import { PokemonProfile } from "@/components/homeServer";
import { getRandomPokemon } from "./util/pokemonAPI";

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
  const pk = await getRandomPokemon();
  return (
    <main>
      <PokemonProfile firstPokemon={pk}/>
      <TidalSearch clientId={process.env.TIDAL_CLIENT_ID as string} clientSecret={ process.env.TIDAL_CLIENT_SECRET as string}/>
    </main>
  );
}
