import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import {v4 as uuid4} from 'uuid';

function QuestionList({formData}) {
    const [loading,setLoading] = useState(true);
    const [questionList, setQuestionList] = useState();
    const [databaseLoading, setDatabaseLoading] = useState(false);
    const {user} = useUser();
    useEffect(() => {
        if(formData){
            GenerateQuestionList();
        }
    },[formData]);

    const GenerateQuestionList = async () => {
        setLoading(true);
        try {
            const result = await axios.post('/api/ai-model',{
                ...formData
            })
            console.log(result.data.content);
            const CONTENT = result.data.content;
            const FINAL_CONTENT = CONTENT.replace('```json','').replace('```','')
            setQuestionList(JSON.parse(FINAL_CONTENT)?.interviewQuestions);
            setLoading(false);
        } catch (e) {
            toast('Sorry, there is a server error!');
            toast('Please try again!');
            console.log('Error while fetching the result from AI model: ' + e);
            setLoading(false);
        }
    }
    const onFinish = async() => {
        setDatabaseLoading(true);
        const interviewId = uuid4();
        const { data, error } = await supabase
            .from('Interviews')
            .insert([
                { 
                    ...formData,
                    questionList:questionList,
                    userEmail:user?.email,
                    interview_id:interviewId
                 },
            ])
            .select()
        setDatabaseLoading(false);
        console.log(data);
    }
  return (
    <div>
        {loading && 
            <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
                <Loader2Icon className='animate-spin' />
                <div>
                    <h2 className='font-medium'>Generating Interview Questions...</h2>
                    <p className='text-primary'>Our AI is crafting personalised questions based on your job position.</p>
                </div>
            </div>
        }
        {questionList?.length > 0 &&
            <div>
                <QuestionListContainer questionList={questionList} />
            </div>
        }
        <div className='flex justify-end mt-10'>
            <Button onClick={()=>onFinish()} disabled={databaseLoading}>
                {databaseLoading && <Loader2Icon className='animate-spin' />}
                Finish
            </Button>
        </div>
    </div>
  )
}

export default QuestionList