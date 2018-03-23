"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require("isomorphic-fetch");
var config = require("./../conf");
exports.get_ql_data = (q, key) => new Promise((resolve, rej) => {
    fetch(config.graphql_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: q
        }),
    })
        .then(res => res.json())
        .then(res => {
        // console.log("res", res)
        resolve(res.data[key]);
    });
});
exports.notify = (LineId, title, description) => new Promise((resolve, rej) => {
    fetch(config.notify_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title,
            LineId,
            description
        }),
    }).then(function (response) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
        .then(function (stories) {
        // console.log(stories);
    });
});
var main = () => __awaiter(this, void 0, void 0, function* () {
    // let a = await get_ql_data(`
    // {
    //   FbEventQueryBefore(skip:0){  
    //     parentGroupId
    //     parentGroupName,
    //     owner ,
    //     description,
    //     title,
    //     startTime,
    //     image,
    //     eventId
    // }
    // }
    // `, "FbEventQueryBefore")
    // console.log("a", a)
    // a.map((d, i) => {
    //     console.log(d)
    // })
});
main();
