import React, { createContext } from 'react';
import { User } from '@supabase/supabase-js';

interface IRootAppContext {
    id: string
    user: User | null
    setId?: React.Dispatch<React.SetStateAction<string>>
    setUser?: React.Dispatch<React.SetStateAction<User | null>>
}

export const RootAppContext = createContext<IRootAppContext>({
    id: 'new',
    user: null,
    setId: () => { },
    setUser: () => { },
})