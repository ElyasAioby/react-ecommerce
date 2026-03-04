import App from "./App";
import { QueryClientProvider, QueryClient} from "@tanstack/react-query";
const queryClient = new QueryClient();

const MainApp = () => {
    return(
        <QueryClientProvider  client={queryClient}>
            <App/>
        </QueryClientProvider>
    )
}


export default MainApp
