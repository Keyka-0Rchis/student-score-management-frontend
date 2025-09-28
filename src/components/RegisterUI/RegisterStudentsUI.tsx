import { useState } from 'react';
import React from 'react';
import styles from './RegisterStudents.module.css';
import { format } from 'date-fns';

function RegisterStudentsUI(
    // props:{loading:boolean}
){
    const [csvData, setCsvData] = useState<string[][]>([]);
    const [loading,setLoading] = useState(false);
    const [errorMessage,setErrorMessage] = useState<string[]>([]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage([]);// エラーの状態を初期化
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
        const formatDate = (str:string) => {
            const d = new Date(str);
            return format(d,"yyyy-MM-dd");
        };
        // 正規表現で生年月日をチェック（yyyy-MM-ddになっているか）
        const isValidDateFormat = (str: string) => /^\d{4}-\d{2}-\d{2}$/.test(str);
        const [header, ...rows] = csvData;
        // エラー集積用の配列
        let errors : string[] = [];
        const addErrors = (count:number,item:string) => {
            errors.push(count+"行目："+item+"が不正です")
        }
        // ヘッダーに合わせて入力値をチェック
        const students = rows.map((row,rowIndex) => {
            const obj: any = {};
            let record = rowIndex + 1;
            row.forEach((cell, i) => {
                const key = header[i].trim();
                switch (key){
                    case "studentId":
                    case "firstGradeNum":
                    case "secondGradeNum":
                    case "thirdGradeNum":
                        if (!isNaN(Number(cell))){
                            obj[key] = cell.trim(); 
                        } else {
                            addErrors(record,key);
                        }
                        break;
                    case "name":
                        if (isNaN(Number(cell))){
                            obj[key] = cell.trim(); 
                        } else {
                            addErrors(record,key);
                        }
                        break;
                    case "birthDate":
                        if (isValidDateFormat(formatDate(cell))){
                            obj[key] = formatDate(cell);
                        } else {
                            addErrors(record,key)
                        }
                        break;
                    case "graduationFlag":
                        if (cell.trim().toLowerCase()==="true"||cell.trim().toLowerCase()==="false"){
                            obj[key] = cell.trim().toLowerCase()==="true";    
                        } else {
                            addErrors(record,key);
                        }
                }
            });
            console.log(obj);
            return obj;
        });

        if (errors.length > 0){
            setErrorMessage(errors);
            alert(errors.join("\n"));
            return;
        }

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
            alert(result.message);
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
                {errorMessage.length > 0 &&(
                    <div className='errorBox'>
                        {errorMessage.map((e,i) => (
                            <p key={i}>{e}</p>
                        ))}
                    </div>
                )}
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