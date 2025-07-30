"use client"
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { Mic, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';

function StartInterview() {
  const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);

  const vapi = new Vapi('242e39d8-5667-45f9-8c60-74850a82c939');
  const [activeUser, setActiveUser] = useState(false);

  useEffect(()=>{
    interviewInfo && startCall();
  },[interviewInfo]);

  const startCall = () => {
    let questionList;
    interviewInfo?.interviewData?.questionList.forEach((item, index) => (
      questionList = item?.question + ',' + questionList
    ));
    console.log(questionList);
    const assistantOptions = {
    name: "AI Recruiter",
    firstMessage: `Hi ${interviewInfo?.userName}, how are you? Ready for your interview on ${interviewInfo?.interviewData?.jobPosition}`,
    transcriber: {
      provider:"deepgram",
      model:"nova-2",
      language:"en-US",
    },
    voice: {
      provider: "playht",
      voiceId: "jennifer",
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role:"system",
          content: `
          You are an AI voice assistant conducting interviews.
          Your job is to take an interview of the candidates with the provided set of questions and assess their response.
          Begin the conversation with a friendly introduction, setting a relaxed yet professional tone.
          Example: "Hey there! Are you ready to tackle your ${interviewInfo?.interviewData?.jobPosition} interview? Let's get started with a few questions!"
          Ask one question at a time and wait for the candidate's response before proceeding to the next one. 
          Keep the questions clear and consice. 
          Given below the questions: ${questionList}
          If the candidate struggles, offer hints or rephrase the question without giving away the answer.
          Never give away the answer; suggest the candidate to look it up on their own after the interview.
          Example: "I could give you a little hint. Think about how React tracks component updates. That might help you to figure this out."
          Provide bried, encouraging feedback after each answer.
          Example: "Nice. Thats a good answer" or "Hmmm, that's not what I was expecting to hear. Wanna try again?"
          Keep the conversation natural and engaging - use casual phrases like "Alright, next up..." or "I got a tricky one" or "Hmm this one seems a bit challenging. Let's see how you handle this!" or "Hmmm so you know your stuff"
          After about 5 or 10 questions, if you think the candidate is not up to the mark, wrap up the interview smoothly by summarizing their performance.
          Example: 
          "Good attempt. You took a shot at some tough questions here. You might need to sharpen your MongoDB aggression pipelike skills better. It's not the end of the day. You have a long way to go. Don't worry." 
          After about 5 or 10 questions, if you think the candidate is a good fit for the role as he or she is answering the questions with expected response, then switch up the difficulty in the questions.
          "Nice. You seem like you know your stuff. Well done. Now let's see if I could give you some challenging problems to solve."
          In the end, conclude on a positive note. Encourage the candidate, regardless the interview performance.
          Example: "Thanks for your time. Hope to see you crushing projects soon!"
          Key guidelines:
          - Be friendly, engaging and witty
          - Keep responses short, and natural, like a real conversation between friends
          - Never go off the topic of discussion. If the interviewee attempts to ask questions outside of the interview, give a gentle warning, on the second attempt change the tone to a serious one and issue a strict warning that if he or she does it again, the interview will be terminated and on the third attempt, terminate the interview. 
          In such case, maintain a neutral tone and make sure the user is told the interview is terminated since he or she wasn't focusing on the interview and was more curious about the other things.
          - Adapt based on the candidate's confidence level
          - Ensure the interview remains focused on the {{jobPosition}}

          `
        }
      ]
    }
    }
    // Start voice conversation
    vapi.start(assistantOptions);
    vapi.on('call-start', () => {
      console.log('Call started');
      toast('Call connected.')
    });
  }

  const stopInterview = () => {
    vapi.stop();
    setActiveUser(false);
    vapi.on('call-end', () => {
      console.log('Call ended');
      toast('Interview ended.');
    });
  }

  vapi.on("speech-start", () => {
    console.log("Assistant speech has started");
    setActiveUser(true);
  })

  vapi.on("speech-end", () => {
    console.log("Assistant speech has ended");
    setActiveUser(false);
  })
  
  console.log(interviewInfo)
  return (
    <div className='p-20 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
        <span className='flex gap-2 items-center'>
          <Timer />
          00:00:00
        </span>
      </h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col items-center justify-center'>
          <div className='relative'>
            {activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />}
            <Image 
              src='/ai.jpeg'
              alt='ai'
              width={100}
              height={100}
              className='w-[60px] h-[60px] rounded-full object-cover mb-5'
            />
            <h2>AI Recruiter</h2>
          </div>
        </div>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col items-center justify-center'>
          <div className='relative'>
            {!activeUser && <span className='absolute inset-0 rounded-full bg-blue-500 opacity-75 animate-ping' />}
            <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-5 mb-5'>{interviewInfo?.username[0]}</h2>
            <h2>{interviewInfo?.username}</h2>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-5 justify-center mt-7'>
        <Mic className='h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />
        <AlertConfirmation stopInterview={()=>stopInterview()}>
          <Phone className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
        </AlertConfirmation>
      </div>
      <h2 className='text-sm text-gray-400 text-center mt-5'>Interview In Progress...</h2>
    </div>
  )
}

export default StartInterview;