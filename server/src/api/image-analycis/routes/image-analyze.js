

export default {
    routes: [
        {
            method: "POST",
            path: "/image-analyze",
            handler: "image-analyze.analyze",
            config: { auth: false }

        }
    ]
}