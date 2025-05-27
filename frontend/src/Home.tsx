import React, { useState } from "react"
import axios from "axios"
import { Box, Input, Button, FormControl, FormLabel } from "@mui/joy"
import CustomSnackbar from "./components/CustomSnackbar"

type SoundCloudResponse = {
    downloadUrl?: string
    error?: string
}

const SoundCloudDownloader: React.FC = () => {
    const [link, setLink] = useState<string>("")
    const [downloadUrl, setDownloadUrl] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value)
    }

    const handleDownload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setDownloadUrl("")
        setError("")

        try {
            const baseUrl = process.env.REACT_APP_ENDPOINT_URL
            const response = await axios.post(`${baseUrl}/api/soundcloud`, {
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: link }),

            })
            const data: SoundCloudResponse = await response.data.json()

            if (data.downloadUrl) {
                setDownloadUrl(data.downloadUrl)
            } else {
                setError(data.error || "Terjadi kesalahan")
            }
        } catch (err) {
            setError("Gagal terhubung ke server")
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Box
            margin={"auto"}
            width={500}
            sx={{
                backgroundColor: "white",
                opacity: 0.9,
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
            <h2>SoundCloud Audio Downloader</h2>
            <form onSubmit={handleDownload}>
                <FormControl>
                    <FormLabel>Masukkan Link SoundCloud</FormLabel>
                    <Input name="soundcloud_link" value={link} onChange={handleChange} placeholder="https://soundcloud.com/..." required />
                </FormControl>
                <Button type="submit" sx={{ mt: 2 }} loading={isLoading}>
                    Download
                </Button>
            </form>

            {downloadUrl && (
                <Box sx={{ mt: 3, p: 2, background: "#e7ffe7", borderRadius: "8px" }}>
                    <b>Link Download:</b>
                    <br />
                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                        Klik untuk Download
                    </a>
                </Box>
            )}

            <CustomSnackbar open={!!error} onClose={() => setError("")} message={error} severity="error" />

            <CustomSnackbar open={isLoading} onClose={() => setIsLoading(false)} message="Memproses, tunggu sebentar..." severity="loading" />
        </Box>
    )
}

export default SoundCloudDownloader
