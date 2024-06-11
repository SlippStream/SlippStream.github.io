import Image from "next/image";
import { PrismaClient } from "@prisma/client";
import { getNumberOfPokemon, getPokemonById, getRandomPokemon, updatePokemonEntries } from "./util/pokemonAPI";

export const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  //updatePokemonEntries();
  const pokemon = await getRandomPokemon();
  console.log(`random pokemon: #${pokemon.id} ${pokemon.name}`);
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
  const pokemon = await getRandomPokemon();
  return (
    <main>
      <Image 
      src={pokemon.sprites.front_default}
      width={500}
      height={500}
      alt={pokemon.name}/>
    </main>
  );
}
