import test from "node:test";import assert from "node:assert/strict";import {handleMcp} from "../src/mcp-server.js";
const args={targets:[{id:"t",risk:90,lastScannedAt:null,estimatedMinutes:10,requiredCapabilities:["x"]}],scanners:[{id:"s",capacityMinutes:20,capabilities:["x"]}],history:[],policy:{maxAgeHoursByRisk:[[0,24]],horizonMinutes:20},now:"2026-09-14T17:00:00Z"};
test("MCP initialize",()=>assert.equal(handleMcp({id:1,method:"initialize"}).result.serverInfo.name,"shpbl-scan-coverage-autopilot"));
test("MCP lists three tools",()=>assert.equal(handleMcp({id:1,method:"tools/list"}).result.tools.length,3));
test("MCP plan returns sealed structured content",()=>{const r=handleMcp({id:1,method:"tools/call",params:{name:"scan_plan",arguments:args}});assert.equal(r.result.structuredContent.seal.length,64);});
test("MCP unknown tool fails bounded",()=>assert.match(handleMcp({id:1,method:"tools/call",params:{name:"wat",arguments:args}}).error.message,/E_TOOL/));
