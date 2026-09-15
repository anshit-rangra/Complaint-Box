import { useContext, useEffect } from "react"
import { getId } from "../services/api/authApi"
import { TokenContext } from "../context/TokenContext"


export function useHydrateToken() {
    const { setToken } = useContext(TokenContext);

    useEffect(() => {
        async function hydrate() {
            let token = localStorage.getItem("token");

            if (!token) {
                token = await getId();
                localStorage.setItem("token", token);
            }

            setToken(token);
        }

        hydrate();
    }, [setToken]);
}