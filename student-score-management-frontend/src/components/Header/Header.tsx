import styles from './Header.module.css'
import { Link } from 'react-router-dom';
//module.cssをインポート。stylesは慣習的な名前。

function Header(props: { title: string ,onMenuClick : () => void }) {
  return (
    <div className={styles.header}>
      <i className={`fas fa-bars ${styles.bars}`} onClick={props.onMenuClick}></i>
      <Link to="/mainmenu" className={styles.titleLink}>
        <h1 className={styles.title}>{props.title}</h1>
      </Link>
    </div>
  );
}

export default Header;