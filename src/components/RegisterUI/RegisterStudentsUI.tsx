import { useState } from 'react';
import React from 'react';
import styles from './RegisterStudents.module.css'

function RegisterStudentsUI(
    // props:{loading:boolean}
){
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [loading,setLoading] = useState(false);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        
        // ファイルがなければ何もしない
        if (!file) return;

        const reader = new FileReader();
        // 読み込んだcsvをテキストに。
        reader.onload = (e) => {
            const text = e.target?.result as string;
            // 改行で分割して行ごとに
            const rows = text.split('\n').map(row => row.split(','));
            setCsvData(rows);
        }
        reader.readAsText(file);
    }

    //登録処理
    const handleSubmit = async () => {
        // studentId,firstGradeNum,secondGradeNum,thirdGradeNum,name,birthDate,graduateFlag
        const formatDate = (dateStr: string) => {
            const d = new Date(dateStr);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`; // ← LocalDateが理解できる形式--でつなぐ形に変換
        };
        const [header, ...rows] = csvData;
        const students = rows.map((row) => {
            const obj: any = {};
            row.forEach((cell, i) => {
                const key = header[i].trim();
                if (key === "birthDate"){
                    obj[key] = formatDate(cell);
                }else if(key === "graduationFlag"){
                    obj[key] = cell.trim().toLowerCase()==="true";
                }else{
                    obj[header[i]] = cell.trim();
                }
            });
            console.log(obj);
            return obj;
        });

        try {
            setLoading(true);
            const response = await fetch("http://localhost:8080/api/students/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(students), // 複数生徒まとめて送信
            });

            if (!response.ok) {
                throw new Error("通信に失敗しました");
            }

            const result = await response.json();
            console.log(result.message);
            alert("登録に成功しました！");
        } catch (error) {
            console.error(error);
            alert("登録に失敗しました…");
        } finally{
            setLoading(false)
        }
    };


    return(
        <div className={styles.RegisterStudentsUI}>
            <div className={styles.RegisterStudentsUIWrapper}>
                <h2>CSVで生徒を追加</h2>
                <input type="file" accept=".csv" onChange={handleFileUpload} />
                {csvData.length > 0 && (
                    <div>
                        <table className={styles.RegisterStudentsTable}>
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
                        <button onClick={handleSubmit}>登録</button>
                    </div>
                )}
                <p className={loading? styles.loading:styles.loaded}></p>
            </div>
        </div>
    )
}

export default RegisterStudentsUI;