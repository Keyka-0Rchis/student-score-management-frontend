import styles from './SideMenu.module.css'
import { Link } from 'react-router-dom';

type LinkTo = "/mainmenu" | "/registerStudents" ;

function SideMenu (
    props:{
        titles:{mainmenu:string,registerStudent:string}
        isOpen:boolean}
){
    const items:{mode:LinkTo ; title:string;iconStyle:string}[]=[
        {mode:"/mainmenu",title:props.titles.mainmenu,iconStyle:styles.mainmenuIcon},
        {mode:"/registerStudents",title:props.titles.registerStudent,iconStyle:styles.addIcon},
    ]
    //この後forループっぽくするために、一つ一つのmode毎に変数をまとめておく。
    return (
        <div className={props.isOpen? styles.sidemenuOpen:styles.sidemenuClose}>
            <div className={styles.sidemenuWrapper}>
                {items.map((item) =>(
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

export default SideMenu;