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
exports.get_ql_data = (q, key) => new Promise((resolve, rej) => {
    fetch('https://17book.me/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: q
        }),
    })
        .then(res => res.json())
        .then(res => {
        console.log("show list");
        // console.log(res.data)
        // resolve(res.data[0])
        // console.log(res.data[key]);
        resolve(res.data[key]);
        // s.endDialog("show list")
        // Promise.resolve(res.data.FbEventQuery)
        // let a: Array<any> = res.data.FbEventQuery;
        // return a;
        // a.map((d, i) => {
        //     console.log(d)
        // })
        // res.data.FbEventQuery.map((d: any, i: number) => {
        //   if (i < 10) {
        //     let startTime = Date.parse(d.startTime)
        //     console.log(startTime)
        //     let t = new Date(startTime)
        //     // text += `${d.title} ${startTime.toLocaleDateString()}  `;
        //     text += `${d.title} ${t.toLocaleString()}\r\n`;
        //   }
        // })
    });
});
var main = () => __awaiter(this, void 0, void 0, function* () {
    let a = yield exports.get_ql_data(`
    {
      FbEventQueryBefore(skip:0){  
        parentGroupId
        parentGroupName,
        owner ,
        description,
        title,
        startTime,
        image,
        eventId
    }
    }
    `, "FbEventQueryBefore");
    // console.log("a", a)
    // a.map((d, i) => {
    //     console.log(d)
    // })
});
main();
