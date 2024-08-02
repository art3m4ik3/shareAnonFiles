import { useState, ChangeEvent, useRef } from 'react'
import axios from 'axios'
import styles from '../styles/Home.module.css'

export default function Home() {
    const [ file, setFile ] = useState<File | null>(null)
    const [ fileUrl, setFileUrl ] = useState<string>('')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if ( event.target.files && event.target.files[0] ) {
            setFile(event.target.files[0])
            setFileUrl('')
        }
    }

    const handleUpload = async () => {
        if ( !file ) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await axios.post<{ fileUrl: string }>('http://localhost:3001/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setFileUrl(response.data.fileUrl)

            setFile(null)
            if ( fileInputRef.current ) {
                fileInputRef.current.value = ''
            }
        } catch ( error ) {
            console.error('Error uploading file:', error)
        }
    }

    return (
        <div className={ styles.container }>
            <h1 className={ styles.title }>Anonymous file sharing</h1>
            <div className={ styles.uploadContainer }>
                <label className={ styles.fileInputLabel }>
                    <input
                        type="file"
                        onChange={ handleFileChange }
                        className={ styles.fileInput }
                        ref={ fileInputRef }
                    />
                    <span className={ styles.fileInputText }>
            { file ? file.name : 'Select file' }
          </span>
                </label>
                <button
                    onClick={ handleUpload }
                    className={ styles.uploadButton }
                    disabled={ !file }
                >
                    Upload
                </button>
            </div>
            { fileUrl && (
                <div className={ styles.linkContainer }>
                    <p>The file has been uploaded successfully. Link to the file:</p>
                    <a href={ fileUrl } target="_blank" rel="noopener noreferrer"
                       className={ styles.fileLink }>{ fileUrl }</a>
                </div>
            ) }
        </div>
    )
}