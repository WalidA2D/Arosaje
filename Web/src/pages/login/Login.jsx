import "./login.css"
import { Link } from 'react-router-dom';
function Login(props) {
    return (
        <div>
            Login
            <button>
            <Link to="/home">Home</Link>
            </button>
        </div>
    );
}

export default Login;