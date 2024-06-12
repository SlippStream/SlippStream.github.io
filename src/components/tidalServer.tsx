"use server";
import 'dotenv/config'
import { TidalResult, TidalAPI, tidal } from "@/app/util/tidalAPI";
import { TidalState, parse } from "./tidalSearch";
import { Song } from "@prisma/client";

export interface TidalTrack extends Song {
    albumCover: string;
    artist: string;
    title: string;
    albumName: string;
}

alert(`herp: ${process.env.TIDAL_CLIENT_ID}`);
export const tidalId= process.env.TIDAL_CLIENT_ID;
export const tidalSecret = process.env.TIDAL_CLIENT_SECRET;