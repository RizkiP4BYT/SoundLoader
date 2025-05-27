import type { Express, Request, Response } from "express"
import scdl from "soundcloud-downloader"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import fs from "fs"

// Buat regex untuk clean nama file
const special_character = /[:*?"<>|\\\/]/gi

export function run(app: Express) {
    app.post("/api/soundcloud", async (req: Request, res: Response): Promise<any> => {
        const url: string = req.body.url

        if (!url) {
            return res.status(400).json({
                status: 400,
                message: "You need to insert 'url' parameter for processing Soundcloud Audio.",
            })
        }

        if (!scdl.isValidUrl(url)) {
            return res.status(400).json({
                status: 400,
                message: "The URL is not supported or not a Soundcloud Track URL. Please check your 'url' value. e.g https://soundcloud.com/...",
            })
        }
        const filename = (await scdl.getInfo(url)).title?.replace(special_character, "")
        try {
            await scdl.download(url).then(async (stream) => {
                const s3Client = new S3Client()
                const s3PutObject = new PutObjectCommand({
                    Bucket: "",
                    Key: `${filename}.mp3`,
                    Body: Buffer.from(stream, "base64"),
                })
                const s3Result = await s3Client.send(s3PutObject)
                return res.status(200).json({
                    status: 200,
                    message: "The audio file has been converted successfully",
                    link: "",
                    size: s3Result.Size,
                })
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                message: "An error occurred!",
                error: error,
            })
        }
    })
}
