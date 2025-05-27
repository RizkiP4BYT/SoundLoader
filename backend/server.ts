import express, { type Express } from "express"
import path from "path"
import fs from "fs"
import cors from "cors"

const app: Express = express()
const serverPort = 80

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.set("json spaces", 4)
app.disable("etag")

console.log("Loading REST API routes...")
const apiPath = path.join(__dirname, "src/api")
const apiFiles = fs.readdirSync(apiPath).filter((file) => file.endsWith(".js") || file.endsWith(".ts"))

for (const apiFile of apiFiles) {
    try {
        const apiModule = require(path.join(apiPath, apiFile))
        if (apiModule.run) {
            apiModule.run(app)
            console.log(`Loaded API: ${apiFile}`)
        } else if (apiModule.default && typeof apiModule.default === "function") {
            apiModule.default(app)
            console.log(`Loaded API (default): ${apiFile}`)
        } else {
            console.warn(`No 'run' function found in ${apiFile}`)
        }
    } catch (error) {
        console.error(`Failed to load ${apiFile}:\n`, error)
    }
}

app.listen(serverPort, () => {
    console.log(`REST API server listening on port ${serverPort}`)
})
