import {createHash} from "node:crypto";
export function canonical(v:unknown):string{if(v===null||typeof v!=="object")return JSON.stringify(v);if(Array.isArray(v))return `[${v.map(canonical).join(",")}]`;const o=v as Record<string,unknown>;return `{${Object.keys(o).sort().map(k=>`${JSON.stringify(k)}:${canonical(o[k])}`).join(",")}}`;}
export function sha256(v:unknown):string{return createHash("sha256").update(canonical(v)).digest("hex");}
export function round(n:number,p=6):number{const x=10**p;return Math.round((n+Number.EPSILON)*x)/x;}
