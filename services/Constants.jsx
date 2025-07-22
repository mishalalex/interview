import { BriefcaseBusinessIcon, Calendar, Code2Icon, LayoutDashboard, List, Puzzle, Ruler, Settings, User2Icon, WalletCards } from "lucide-react";

export const SideBarOptions = [
    {
        name:'Dashboard',
        icon: LayoutDashboard,
        path:'/dashboard'
    },
    {
        name:'Scheduled Interview',
        icon: Calendar,
        path:'/scheduled-interview'
    },
    {
        name:'All Interviews',
        icon: List,
        path:'/all-interviews'
    },
    {
        name:'Billing',
        icon: WalletCards,
        path:'/billing'
    },
    {
        name:'Settings',
        icon: Settings,
        path:'/settings'
    }
]

export const InterviewType = [
    {
        title: 'Technical',
        icon: Code2Icon
    },
    {
        title: 'Behavioural',
        icon: User2Icon
    },
    {
        title: 'Experience',
        icon: BriefcaseBusinessIcon
    },
    {
        title: 'Problem-Solving',
        icon: Puzzle
    },
    {
        title: 'Leadership',
        icon: Ruler
    },
]