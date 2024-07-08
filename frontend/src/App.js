import {BrowserRouter,Route,Routes} from 'react-router-dom'; //REACT ROUTER DOM 
import Signup from './SignIn/Signup/Signup' 
import Home from './Home';
import Eventpage from './Eventpage';
import Admin from './AdminPage/Admin';
import AddEvent from './AdminPage/AddEvent';
import EditEvent from './AdminPage/EditEvent';
import LoginForm from './SignIn/Signup/Login';
import MyProfile from './profile';
import Settings from './Settings';
import Users from './SignIn/Signup/Users';
import MyTickets from './MyTickets';
import { ReactNotifications } from 'react-notifications-component'; //REACT NOTIFICATIONS
import "animate.css"; //ANIMATE.CSS
import 'react-notifications-component/dist/theme.css'; //REACT NOTIFICATIONS
import Musicpage from './MusicPage';
import Cinemapage from './CinemaPage';
import ComingSoon from './ComingSoon';
import Sports from './Sports';
import PageLayout from './PageLayout';
import { AdminRoute, ProtectedRoutes} from './Auth/AuthContext'; //AUTHENTICATION AND PROTECTED ROUTES
import AuthDenied from './authDenied';

function App() {
  return (
    <BrowserRouter>
        <ReactNotifications/>
          <Routes>
            {/*SIGN IN/ REGISTER/ USERS */}
            <Route>
                <Route path="/users" element={<Users/>} />
                <Route path="/login" element={<LoginForm/>} />
                <Route path="/register" element={<Signup/>} />
                <Route path='/authorization-denied' element={<AuthDenied/>}/>
            </Route>
            {/*PUBLIC PAGES */}
            <Route element={<PageLayout/>}>
                <Route path="/" element={<Home />} />
                <Route path="/music" element={<Musicpage/>} />
                <Route path="/cinema" element={<Cinemapage/>} />
                <Route path="/sport" element={<Sports/>} />
                <Route path="/arts&theatre" element={<ComingSoon/>} />
                <Route path="/eventpage/:event_id" element={<Eventpage/>} />
            </Route>
            {/*USERS ONLY PAGES */}
            <Route element={<ProtectedRoutes/>}>
            <Route element={<PageLayout/>}>
                <Route path="/myprofile" element={<MyProfile/>} />
                <Route path="/settings" element={<Settings/>} />
                <Route path="/addevent" element={<AddEvent/>} />
                <Route path="/events/edit/:event_id" element={<EditEvent/>} />
                <Route path="/mytickets" element={<MyTickets/>} />
            </Route>
            {/*ADMIN ONLY PAGES */}
            <Route element={<AdminRoute/>}>
            <Route element={<PageLayout/>}>
                <Route path="/admin" element={<Admin/>} />
            </Route>
            </Route>
            </Route>
          </Routes>
    </BrowserRouter>

  );
}

export default App;
