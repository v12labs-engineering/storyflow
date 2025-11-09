import { RootAppContext } from "../context/RootAppContext";
import { useContext } from "react";

const useRootAppContext = () => {
    const {
        id,
        setId,
        user,
        setUser
    } = useContext(RootAppContext)
    return {
        id,
        setId,
        user,
        setUser
    }
}

export default useRootAppContext
