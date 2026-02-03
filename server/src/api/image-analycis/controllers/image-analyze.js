import { analyzeImage } from "../services/gemini.js"

export default {
    async analyze(ctx) {
        const file = ctx.request.files?.image
        if (!file) return ctx.badRequest("No file")
        const filePath = file.path
        try {
            const result = await analyzeImage(filePath)
            return ctx.send({ success: true, result })
        } catch (error) {
            ctx.internalServerError("Error analyzing image", { error: error.message })
        }
    }
}