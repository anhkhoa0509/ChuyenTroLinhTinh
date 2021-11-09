import "./App.css";
import Login from "./components/Login";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";
import AuthProvider from "./Context/AuthProvider";
import AppProvider from "./Context/AppProvider";
import AddRoomModal from "./components/Modals/AddRoomModal";
import InviteMemberModal from "./components/Modals/InviteMemberModal";
import ChatWindow from "./components/ChatRoom/ChatWindow";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Switch>
            <Route component={Login} path="/login" />
            <Route component={ChatWindow} path="/chat" />
            <Route exact path="/" component={ChatRoom} />
          </Switch>
          <AddRoomModal />
          <InviteMemberModal />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
