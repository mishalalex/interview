"use client"
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/services/supabaseClient'
import { toast } from 'sonner'
import { InterviewDataContext } from '@/context/InterviewDataContext'

function Interview() {
    const {interview_id} = useParams();
    const [interviewData, setInterviewData] = useState();
    const [userName, setUserName] = useState();
    const [loading, setLoading] = useState(false);

    const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);

    const router = useRouter();

    useEffect(() => {
        interview_id && GetInterviewDetails();
    },[interview_id])

    const GetInterviewDetails = async() => {
        setLoading(true)
        try {
            let { data: Interviews, error } = await supabase
                .from('Interviews')
                .select('jobPosition,jobDescription,duration,type')
                .eq('interview_id',interview_id)
                setInterviewData(Interviews[0])
                console.log(Interviews[0])
                setLoading(false);
                if(Interviews?.length == 0){
                    toast('Incorrect interview link');
                }
        } catch (error) {
            setLoading(false);
            toast('Incorrect interview link');
            
        } finally {
            setLoading(false);
        }
    };

    const onJoinInterview = async() => {
        setLoading(true);
        let { data: Interviews, error } = await supabase
                .from('Interviews')
                .select('*')
                .eq('interview_id',interview_id);

        console.log(`Interviews data: ${Interviews[0]}`);
        setInterviewInfo({
            username: userName,
            interviewData: Interviews[0]
        });
        router.push(`/interview/${interview_id}/start`)
        setLoading(false);
    };

  return (
    <div className='px-10 md:px-28 lg:px-48 xl:px-88 mt-7'>
        <div className='flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-33 xl:px-52  mb-20'>
            <Image 
                src={'/logo.png'} 
                alt='logo'
                width={100}
                height={100}
                className='w-[140px]'
            />
            <h2 className='mt-3'>
                AI-Powered Interview Platform
            </h2>
            <Image 
                src={'/interview.png'}
                alt='interview'
                width={500}
                height={500}
                className='w-[280px] my-6'
            />
            <h2 className='font-bold text-xl'>
                {interviewData?.jobPosition}
            </h2>
            <h2 className='flex gap-2 items-center text-gray-500 mt-3 '>
                <Clock />{interviewData?.duration}
            </h2>
            <div className='w-full'>
                <h2>Enter your fullname</h2>
                <Input 
                    placeholder='e.g. John Smith' 
                    onChange={(event) => setUserName(event.target.value)}
                />
            </div>
            <div className='p-3 bg-blue-100 flex gap-4 rounded-lg mt-3'>
                <Info className='text-primary' />
                <div>
                    <h2 className='font-bold'>Before you begin</h2>
                    <ul>
                        <li className='text-sm text-primary'>
                            - Test your camera and microphone
                        </li>
                        <li className='text-sm text-primary'>
                            - Ensure you have stable internet connection
                        </li>
                        <li className='text-sm text-primary'>
                            - Find a quiet place for the interview
                        </li>
                        <li className='text-sm text-primary'>
                            - Speak clearly to the microphone
                        </li>
                    </ul>
                </div>
            </div>
            <Button 
                className='mt-5 w-full font-bold'
                disabled={loading || !userName? true : false}
                onClick={() => onJoinInterview()}
            >
                <Video /> {loading && <Loader2Icon/>} Join Interview
            </Button>
        </div>
    </div>
  )
}

export default Interview