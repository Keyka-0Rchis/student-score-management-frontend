import styles from './MainMenu.module.css'
import { Link } from 'react-router-dom';

type LinkTo ="/RegisterStudentsUI";

function MainMenu (
    props:{
        titles:{registerStudents:string}
    }
){
    const items:{mode:LinkTo ; title:string;iconStyle:string}[]=[
        {mode:"/RegisterStudentsUI",title:props.titles.registerStudents,iconStyle:styles.addIcon},
    ]
    //この後forループっぽくするために、一つ一つのmode毎に変数をまとめておく。
    return (
        <div className={styles.mainmenu}>
            <div className={styles.mainmenuWrapper}>
                {items.map((item) =>(
                    //遷移はLinkタグを使う。表示はaタグ扱い。toで行き先を指定。
                    <Link
                        to={item.mode}
                        key={item.mode} 
                        className={`${styles.menuIcon} ${item.iconStyle}`}
                    >
                        <p className={styles.iconPrint}>{item.title}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
//stylesのclassNameは-があるとだめ。camelCaseじゃないとエラーになる。
export default MainMenu;