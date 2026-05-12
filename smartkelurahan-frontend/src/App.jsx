import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {

  const [nama, setNama] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [file, setFile] = useState(null)

  const [data, setData] = useState([])

  const fetchData = async () => {

    const res = await axios.get('/pengaduan')

    setData(res.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e) => {

    e.preventDefault()

    const formData = new FormData()

    formData.append('nama', nama)
    formData.append('deskripsi', deskripsi)
    formData.append('file', file)

    await axios.post('/pengaduan', formData)

    alert('Pengaduan berhasil dikirim')

    setNama('')
    setDeskripsi('')
    setFile(null)

    fetchData()
  }

  return (
    <div className="container">

      <h1>SmartKelurahan</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
        />

        <textarea
          placeholder="Deskripsi"
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">
          Kirim
        </button>

      </form>

      <div className="list">

        {
          data.map((item) => (

            <div className="card" key={item.id}>

              <h3>{item.nama}</h3>

              <p>{item.deskripsi}</p>

              <img
                src={item.file_url}
                alt=""
                width="300"
              />

            </div>
          ))
        }

      </div>

    </div>
  )
}

export default App