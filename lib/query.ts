const fetch = require("isomorphic-fetch")

export const get_ql_data = (q: string, key: string) => new Promise((resolve, rej) => {

    fetch('https://17book.me/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: q
        }),
    })
        .then(res => res.json())
        .then(res => {
            console.log("show list")
            // console.log(res.data)
            // resolve(res.data[0])

            // console.log(res.data[key]);
            resolve(res.data[key])

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


var main = async () => {

    let a = await get_ql_data(`
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
    `, "FbEventQueryBefore")

    // console.log("a", a)
    // a.map((d, i) => {
    //     console.log(d)

    // })
}

main();