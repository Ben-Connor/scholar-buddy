import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';

function HomeButton() {
  return (
    <Link to="/" className="home-button">
      <img src={logo} alt="Logo" style={{ width: '70px', height: 'auto', borderRadius: '20px' }}/>
    </Link>
  );
}

export default HomeButton;
