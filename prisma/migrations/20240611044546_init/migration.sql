-- CreateTable
CREATE TABLE "Song" (
    "tidalId" INTEGER NOT NULL,
    "tidalUrl" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("tidalId")
);

-- CreateTable
CREATE TABLE "Pokemon" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "Pokemon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Type" (
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "_PokemonToType" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PokemonToSong" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonToType_AB_unique" ON "_PokemonToType"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonToType_B_index" ON "_PokemonToType"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonToSong_AB_unique" ON "_PokemonToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonToSong_B_index" ON "_PokemonToSong"("B");

-- AddForeignKey
ALTER TABLE "_PokemonToType" ADD CONSTRAINT "_PokemonToType_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToType" ADD CONSTRAINT "_PokemonToType_B_fkey" FOREIGN KEY ("B") REFERENCES "Type"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToSong" ADD CONSTRAINT "_PokemonToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "Pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonToSong" ADD CONSTRAINT "_PokemonToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("tidalId") ON DELETE CASCADE ON UPDATE CASCADE;
