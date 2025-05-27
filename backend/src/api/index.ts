import type { Express, Request, Response } from "express"

export function run(app: Express) {
    app.all("/api", async (req: Request, res: Response): Promise<any> => {
        return res.status(200).json({
            status: 200,
            message: "Hello world, I'm from server A",
        })
    })
}
