import "./styles/global.css";
import "./lib/dayjs";
import { Plus } from "phosphor-react";
import { Header } from "./components/Header";
import { SummaryTable } from "./components/SummaryTable";
import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { UserContextProvider } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Dicas de Implementação

//Autenticação (Firebase, oAuth0)
//Notificações Push
//Perfil Publico com gráfico de resumo!

export function App() {
  return (
    <>
      <UserContextProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </UserContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}
