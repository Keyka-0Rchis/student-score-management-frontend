import { useEffect, useState } from 'react';
import styles from './ViewStudentsUI.module.css'

function ViewStudentsUI(){
    type Student = {
        studentId: number;
        firstGradeNum: number;
        secondGradeNum: number;
        thirdGradeNum: number;
        name: string;
        birthDate: string;
        graduationFlag: boolean;
    }
    //上の型の"studend_id"|"firstGradenum"|...を保持
    type StudentField = keyof Student;

    const [students,setStudents] = useState<Student[]>([]);
    const [loading,setLoading] = useState(true);
    const [editMode,setEditMode] = useState(false);

    const toggleEditMode = ()=>{
        setEditMode(editMode => !editMode)
    }

    //KはStudentの各フィールド名を返す。Student[K]は対応する型を返す。これで、フィールド名にあった型の値のみ受け付ける。
    const editValue = <K extends StudentField>(id: number, field: K, value: Student[K]) => {
        setStudents(prev =>
            prev.map(
                s => s.studentId === id ? {...s, [field]:value} : s
                // ...sはsのコピーを作成し、ターゲット検索、操作、反映、の流れ
            )
        )
    }

    // とりあえずアクセス時に実行にして、動作確認。今後検索機能、編集機能を実装したい。
    useEffect(() => {
        const fetchStudents = async() => {
            try{
                const response = await fetch("http://localhost:8080/api/students/viewStudents");
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
    },[editMode]);//toggleしたときにも発動させたい。保存せずに戻った時に、ＤＢに保存した値に戻したいので。

    if (loading) return <p>読み込み中...</p>

    //更新処理
    const handleSubmit = async () => {
        // studentId,firstGradeNum,secondGradeNum,thirdGradeNum,name,birthDate,graduateFlag
        try {
            setLoading(true);
            console.log(students)
            const response = await fetch("http://localhost:8080/api/students/editStudents", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(students), // 状態で持っている生徒を送信
            });

            if (!response.ok) {
                throw new Error("通信に失敗しました");
            }

            const result = await response.json();
            console.log(result.message);
            alert(result.message);
        } catch (error) {
            console.error(error);
            alert("生徒情報の更新に失敗しました…");
        } finally{
            toggleEditMode();
            setLoading(false);
        }
    };

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
                        <td>
                            {editMode? 
                                <input 
                                    type="text" 
                                    value={s.firstGradeNum}
                                    onChange={(e) => editValue(s.studentId,"firstGradeNum", Number(e.target.value))}
                                 /> 
                                : s.firstGradeNum
                            }
                        </td>
                        <td>
                            {editMode? 
                                <input 
                                    type="text" 
                                    value={s.secondGradeNum}
                                    onChange={(e) => editValue(s.studentId,"secondGradeNum", Number(e.target.value))}
                                 /> 
                                : s.secondGradeNum
                            }
                        </td>
                        <td>
                            {editMode? 
                                <input 
                                    type="text" 
                                    value={s.thirdGradeNum}
                                    onChange={(e) => editValue(s.studentId,"thirdGradeNum", Number(e.target.value))}
                                 /> 
                                : s.thirdGradeNum
                            }
                        </td>
                        <td>
                            {editMode? 
                                <input 
                                    type="text" 
                                    value={s.name}
                                    onChange={(e) => editValue(s.studentId,"name", e.target.value)}
                                 /> 
                                : s.name
                            }
                        </td>
                        <td>
                            {editMode? 
                                <input 
                                    type="text" 
                                    value={s.birthDate}
                                    onChange={(e) => editValue(s.studentId,"birthDate", e.target.value)}
                                 /> 
                                : s.birthDate
                            }
                        </td>
                        <td>
                            {editMode? 
                                <input 
                                    type="checkbox"
                                    checked={s.graduationFlag}
                                    onChange={(e) => editValue(s.studentId,"graduationFlag", e.target.checked)}
                                 /> 
                                : s.graduationFlag ? "◯" : ""
                            }
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={toggleEditMode}>{editMode? "保存せずに戻る" : "編集モードに切り替え"}</button>
            <button onClick={handleSubmit}>変更を保存する</button>
        </div>
    )
}

export default ViewStudentsUI