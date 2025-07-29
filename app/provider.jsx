"use client";
import { UserDetailContext } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import React, {useContext, useEffect, useState} from "react";

function Provider({children}){

    // to set the user across the application
    const [user,setUser] = useState();

    // 
    useEffect(() => {
        CreateNewUser();
    },[]);

    const CreateNewUser = () => {
        supabase.auth.getUser().then(async({data:{user}}) => {
            // check whether existing user by comparing email
            let { data: Users, error } = await supabase
                .from('Users')
                .select("*")
                .eq('email',user?.email);

            console.log("Existing user found: ",Users)

            // if not, create new user
            if(Users?.length === 0){
                console.log("User not found. Creating a new user...")
                const {data,error} = await supabase
                    .from("Users")
                    .insert([
                        {
                            name:user?.user_metadata?.name,
                            email:user?.email,
                            picture:user?.user_metadata?.picture
                        }
                    ])
                    console.log(data);
                    setUser(data);
                    return;
            }
            setUser(Users[0]);
        })
    }

    return (
        <UserDetailContext.Provider value={{user,setUser}}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    )
}

export default Provider;

export const useUser = () => {
    const context = useContext(UserDetailContext);
    return context;
}