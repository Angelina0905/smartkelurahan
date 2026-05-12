import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  // PENGAJUAN
  const [nama, setNama] = useState('')
  const [jenis, setJenis] = useState('')
  const [file, setFile] = useState(null)

  // PENGADUAN
  const [judul, setJudul] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [foto, setFoto] = useState(null)

  // API BACKEND
  const API_URL = 'http://15.135.240.111:5000'

  // SUBMIT PENGAJUAN
  const submitPengajuan = async (e) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append('nama', nama)
    formData.append('jenis', jenis)
    formData.append('file', file)

    try {

      await axios.post(
        `${API_URL}/pengajuan`,
        formData
      )

      alert('Pengajuan berhasil')

    } catch (error) {

      console.log(error)

      alert('Pengajuan gagal')
    }
  }

  // SUBMIT PENGADUAN
  const submitPengaduan = async (e) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append('judul', judul)
    formData.append('deskripsi', deskripsi)
    formData.append('foto', foto)

    try {

      await axios.post(
        `${API_URL}/pengaduan`,
        formData
      )

      alert('Pengaduan berhasil')

    } catch (error) {

      console.log(error)

      alert('Pengaduan gagal')
    }
  }

  return (

    <div className="container">

      <h1>SmartKelurahan</h1>

      {/* FORM PENGAJUAN */}
      <div className="card">

        <h2>Pengajuan Surat</h2>

        <form onSubmit={submitPengajuan}>

          <input
            type="text"
            placeholder="Nama"
            onChange={(e) => setNama(e.target.value)}
          />

          <input
            type="text"
            placeholder="Jenis Surat"
            onChange={(e) => setJenis(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button type="submit">
            Kirim Pengajuan
          </button>

        </form>

      </div>

      {/* FORM PENGADUAN */}
      <div className="card">

        <h2>Pengaduan Masyarakat</h2>

        <form onSubmit={submitPengaduan}>

          <input
            type="text"
            placeholder="Judul Pengaduan"
            onChange={(e) => setJudul(e.target.value)}
          />

          <textarea
            placeholder="Deskripsi Pengaduan"
            onChange={(e) => setDeskripsi(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFoto(e.target.files[0])}
          />

          <button type="submit">
            Kirim Pengaduan
          </button>

        </form>

      </div>

    </div>
  )
}

export default App