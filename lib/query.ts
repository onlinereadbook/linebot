
const fetch = require("isomorphic-fetch")
var config = require("./../conf");

export const get_ql_data = (q: string, key: string) => new Promise((resolve, rej) => {

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
            resolve(res.data[key])
        });

});

export const notify = (LineId: string, title: string, description: string) => new Promise((resolve, rej) => {
    fetch(config.notify_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title,
            LineId,
            description
        }),
    }).then(function (response: any) {
        if (response.status >= 400) {
            throw new Error("Bad response from server");
        }
        return response.json();
    })
        .then(function (stories: any) {
            // console.log(stories);
        });
})

var main = async () => {


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
}

main();