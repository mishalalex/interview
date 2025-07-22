import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {AppSidebar} from './_components/AppSidebar';
import WelcomeContainer from './dashboard/_components/WelcomeContainer';
import Provider from '../provider';


function DashboardProvider({children}) {
    return(
        <Provider>
            <SidebarProvider>
            <AppSidebar />
            <div className='w-full'>
                <WelcomeContainer />
                {children}
            </div>
        </SidebarProvider>
        </Provider>
    )
}

export default DashboardProvider;