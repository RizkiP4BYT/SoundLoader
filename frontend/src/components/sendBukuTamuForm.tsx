'use server'
import React, { useEffect } from 'react'
import { Dayjs } from 'dayjs'
import axios, { AxiosResponse } from 'axios'

interface FormData {
    name: String
    kelas: String
    whatsapp: String
    tanggalKunjungan: Dayjs
    tujuan: String
}

export async function sendForm(formdata: FormData) {
    const response: AxiosResponse = await axios.post(
        process.env.REACT_APP_API_URL + '/bukutamu',
        {
            name: formdata.name,
            kelas: formdata.kelas,
            whatsapp: formdata.whatsapp,
            tanggalKunjungan: formdata.tanggalKunjungan.toDate(),
            tujuan: formdata.tujuan
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )

    if (response.status === 200) {
        return {
            sended: true,
            error: ''
        }
    } else {
        return {
            sended: false,
            error: response.data
        }
    }
}
