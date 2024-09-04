"use client";
import { useEffect } from "react";
import { TidalState } from "./tidalSearch.tsx";


export function TidalList({state}:{ state: TidalState }) {    
    
    return (
        <main>
            <input name="list" type="hidden"></input>
            <ul>
                {state.list.map((v) => (
                    <li>
                        <h1>{v.title}</h1>
                        <h2>{v.artist}</h2>
                    </li>
                ))}
            </ul>
        </main>
    )
}
