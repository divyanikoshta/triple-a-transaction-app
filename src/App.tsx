
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddAccount from "./pages/AddAccount";
import AccountDetails from "./pages/AccountDetails";
import TransferFunds from "./pages/TransferFunds";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";


const App = () => (
    <BrowserRouter>
        <Layout>
            <Routes>
                <Route path="/" element={<AddAccount />} />
                <Route path="/add-account" element={<AddAccount />} />
                <Route path="/account-details" element={<AccountDetails />} />
                <Route path="/transfer" element={<TransferFunds />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Layout>
    </BrowserRouter>
);

export default App;