
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
    let status = 0;
    fetch(config.notify_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title,
            LineId,
            description
        }),
    }).then(function (response: any) {
        status = response.status
        // if (response.status >= 400) {
        //     // console.log(response.body)
        //     throw new Error("Bad!! response from server");
        // }
        return response.json();
    })
        .then(function (stories: any) {
            console.log(stories);
            resolve({
                message: stories.message,
                status: status
            })

        });
})

var main = async () => {
    let m = notify("xxxxxxxx", "ok", "bad").then(result => {
        console.log("result", result);

    }).catch(e => {
        console.log("e", e)
    })

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

// main();

