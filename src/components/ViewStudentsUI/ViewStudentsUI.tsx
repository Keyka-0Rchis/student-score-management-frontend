import { useEffect, useState } from 'react';
import styles from './ViewStudentsUI.module.css'

function ViewStudentsUI(){
    type Student = {
        studentId: number;
        firstGradeNum: number;
        secondGradeNum: number;
        thirdGradeNum: number;
        name: string;
        birth: string;
        graduateFlag: boolean;
    }

    const [students,setStudents] = useState<Student[]>([]);
    const [loading,setLoading] = useState(true);

    // とりあえずアクセス時に実行にして、動作確認。今後検索機能、編集機能を実装したい。
    useEffect(() => {
        const fetchStudents = async() => {
            try{
                const response = await fetch("http://localhost:8080/api/students/ViewStudents");
                if(!response.ok) throw new Error("通信に失敗しました");
                const data = await response.json();
                setStudents(data);
            }catch(err){
                console.error(err)
            }finally{
                setLoading(false)
            }
        };
        fetchStudents();
    },[]);

    if (loading) return <p>読み込み中...</p>

    return (
        <div className={styles.ViewStudentsWrapper}>
            <h2>生徒一覧</h2>
            <table className={styles.ViewStudentsTable}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>1年次出席番号</th>
                        <th>2年次出席番号</th>
                        <th>3年次出席番号</th>
                        <th>氏名</th>
                        <th>生年月日</th>
                        <th>卒業</th>
                    </tr>
                </thead>
                <tbody>
                {students.map((s) => (
                    <tr key={s.studentId}>
                        <td>{s.studentId}</td>
                        <td>{s.name}</td>
                        <td>{s.firstGradeNum}</td>
                        <td>{s.secondGradeNum}</td>
                        <td>{s.thirdGradeNum}</td>
                        <td>{s.birth}</td>
                        <td>{s.graduateFlag ? "◯" : ""}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ViewStudentsUI