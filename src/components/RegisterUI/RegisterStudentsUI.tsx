import { useState } from 'react';
import React from 'react';
import styles from './RegisterStudents.module.css'

function RegisterStudentsUI(){
    const [csvData, setCsvData] = useState<string[][]>([])

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        
        // ファイルがなければ何もしない
        if (!file) return

        const reader = new FileReader()
        // 読み込んだcsvをテキストに。
        reader.onload = (e) => {
            const text = e.target?.result as string
            // 改行で分割して行ごとに
            const rows = text.split('\n').map(row => row.split(','))
            setCsvData(rows)
        }
        reader.readAsText(file)
    }

    return(
        <div className={styles.RegisterStudentsUI}>
            <div className={styles.RegisterStudentsUIWrapper}>
                <h2>CSVで生徒を追加</h2>
                <input type="file" accept=".csv" onChange={handleFileUpload} />

                {csvData.length > 0 && (
                <table border={1}>
                    <thead>
                    <tr>
                        {csvData[0].map((col, i) => (
                        <th key={i}>{col}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {csvData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                        {row.map((cell, colIndex) => (
                            <td key={colIndex}>{cell}</td>
                        ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
                )}
            </div>
        </div>
    )
}

export default RegisterStudentsUI;