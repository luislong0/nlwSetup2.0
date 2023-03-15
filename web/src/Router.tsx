import { Route, Routes } from "react-router-dom";
import { DefaultLayout } from "./layouts/DefaultLayout";
import { Login } from "./pages/Login";
import { SearchUser } from "./pages/SearchUser";
import { Summary } from "./pages/Summary";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/users/:id" element={<SearchUser />} />
      </Route>
    </Routes>
  );
}
