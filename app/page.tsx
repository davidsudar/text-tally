'use client';

import { Textarea } from '@/components/ui/textarea';
import { stopWords } from '@/lib/stopwords';
import nlp from 'compromise';
import React, { useState } from 'react';
import {
  MoonIcon,
  SunIcon,
  QuestionMarkCircledIcon,
} from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Topic {
  normal: string;
  // other properties...
}

export default function Home() {
  const { setTheme } = useTheme();
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [readingTime, setReadingTime] = useState('0 sec');
  const [speakingTime, setSpeakingTime] = useState('0 sec');
  const [paragraphCount, setParagraphCount] = useState(0);
  const [keyWords, setKeyWords] = useState<
    { word: string; frequency: number }[]
  >([]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const doc = nlp(text);

    const words = text.split(/\s+/).filter((word) => word.length > 0);
    const lines = text.split(/\n/).filter((line) => line.length > 0);
    const characters = text
      .split('')
      .filter((character) => character.trim().length > 0);
    const sentences = text
      .split(/[.!?]+/)
      .filter((sentence) => sentence.length > 0);
    const paragraphs = text
      .split(/\n\n/)
      .filter((paragraph) => paragraph.length > 0);
    const readingTime = Math.ceil(words.length / 200);
    const speakingTime = Math.ceil(words.length / 130);
    const readingTimeFormatted = formatTime(readingTime);
    const speakingTimeFormatted = formatTime(speakingTime);
    const processedWords = words.map((word) =>
      word.toLowerCase().replace(/\W/g, '')
    );
    const nonStopWords = processedWords.filter(
      (word) => !stopWords.includes(word)
    );
    // Calculate word frequencies
    const wordFrequencies = nonStopWords.reduce<{ [key: string]: number }>(
      (acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      },
      {}
    );

    const top10Keywords = Object.entries(wordFrequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, frequency]) => ({ word, frequency }));

    setWordCount(words.length);
    setLineCount(lines.length);
    setCharacterCount(characters.length);
    setSentenceCount(sentences.length);
    setParagraphCount(paragraphs.length);
    setReadingTime(readingTimeFormatted);
    setSpeakingTime(speakingTimeFormatted);
    setKeyWords(top10Keywords);
  };

  const formatTime = (timeInMinutes: number) => {
    const timeInSeconds = timeInMinutes * 60;
    if (timeInSeconds < 60) {
      return `${timeInSeconds} sec`;
    } else if (timeInMinutes < 60) {
      return `${timeInMinutes} min`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const remainingMinutes = timeInMinutes % 60;
      return `${hours}h ${remainingMinutes}min`;
    }
  };

  return (
    <>
      <header className='w-full flex justify-between p-4 absolute top-0'>
        <div></div>
        <h1 className='text-4xl font-bold'>Text Tally</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='icon'>
              <SunIcon className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <MoonIcon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              <span className='sr-only'>Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => setTheme('light')}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <main className='grid md:grid-cols-3 min-h-screen px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 pt-24 pb-6 transition-colors gap-4'>
        <Textarea
          placeholder='Type your text here.'
          className='col-span-3 md:col-span-2 h-full'
          id='textInput'
          onChange={handleTextChange}
        />

        <Accordion
          type='single'
          defaultValue={'item-1'}
          className='col-span-3 md:col-span-1'
          collapsible>
          <AccordionItem value='item-1'>
            <AccordionTrigger>Details</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-2'>
              <div className='flex justify-between'>
                <h3 className='text-xl font-bold'>Words</h3>
                <span className='text-xl font-bold'>{wordCount}</span>
              </div>
              <div className='flex justify-between'>
                <h3 className='text-xl font-bold'>Characters</h3>
                <span className='text-xl font-bold'>{characterCount}</span>
              </div>
              <div className='flex justify-between'>
                <h3 className='text-xl font-bold'>Sentences</h3>
                <span className='text-xl font-bold'>{sentenceCount}</span>
              </div>
              <div className='flex justify-between'>
                <h3 className='text-xl font-bold'>Paragraphs</h3>
                <span className='text-xl font-bold'>{paragraphCount}</span>
              </div>
              <div className='flex justify-between'>
                <h3 className='text-xl font-bold'>Lines</h3>
                <span className='text-xl font-bold'>{lineCount}</span>
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-1 justify-center items-center'>
                  <h3 className='text-xl font-bold'>Reading Time</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className='flex justify-center items-center'>
                        <QuestionMarkCircledIcon className='h-3 w-3 text-muted-foreground' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Based on the average reading speed of 200 WPM.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <span className='text-xl font-bold'>{readingTime}</span>
              </div>
              <div className='flex justify-between'>
                <div className='flex gap-1 justify-center items-center'>
                  <h3 className='text-xl font-bold'>Speaking Time</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className='flex justify-center items-center'>
                        <QuestionMarkCircledIcon className='h-3 w-3 text-muted-foreground' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Based on the average speaking speed of 130 WPM.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <span className='text-xl font-bold'>{speakingTime} </span>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>Keywords</AccordionTrigger>
            <AccordionContent className='p-2'>
              <div className='flex flex-col gap-2'>
                {keyWords && keyWords.length > 0 ? (
                  keyWords.map((word, index) => (
                    <div
                      className='flex justify-between'
                      key={index}>
                      <span className='text-xl font-bold'>{word.word}</span>
                      <span className='text-xl font-bold'>
                        {word.frequency}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className='flex justify-center'>
                    Start Typing To See Keywords
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className='flex flex-col gap-2 w-full col-span-3'>
          <h2 className='text-2xl font-bold'>How it works</h2>
          <p className='text-sm'>
            Welcome to Text Tally, your go-to text analyzer! This sophisticated
            tool is designed to dissect your text and provide you with
            insightful metrics, all in real-time. Here&apos;s a breakdown of how
            it works:
          </p>
          <p className='text-sm'>
            <strong>1. Input Your Text:</strong> Start by typing or pasting your
            text into the large text area on the left side of the screen. As you
            type, Text Tally begins to analyze your content instantly.
          </p>
          <p className='text-sm'>
            <strong>2. Get Real-Time Analysis:</strong> The magic happens in
            real-time! As you input your text, the tool instantly counts the
            number of words, characters, lines, sentences, and paragraphs. This
            information is immediately displayed on the right side of the
            screen, giving you a comprehensive understanding of your text&apos;s
            structure.
          </p>
          <p className='text-sm'>
            <strong>3. Estimate Reading and Speaking Times:</strong> Text Tally
            also calculates the estimated reading and speaking times for your
            text. These estimates are based on average reading (200 WPM) and
            speaking (130 WPM) speeds. The results are displayed alongside the
            other metrics.
          </p>
          <p className='text-sm'>
            <strong>4. Identify Key Words:</strong> The tool goes beyond simple
            counting. It identifies and lists the most frequently used non-stop
            words in your text. This can be particularly helpful for SEO
            purposes, content optimization, or identifying the main themes in
            your text.
          </p>
          <p className='text-sm'>
            <strong>5. Customize Your Theme:</strong> We care about your eyes.
            That&apos;s why Text Tally allows you to toggle between light and
            dark themes, or you can choose to use your system&apos;s default
            settings.
          </p>
          <p className='text-sm'>
            <strong>6. Free and Easy to Use:</strong> There&apos;s no need for
            downloads, sign-ups, or payments. Text Tally is a web-based tool
            that&apos;s free and easy to use.
          </p>
          <p className='text-sm'>
            Whether you&apos;re a writer looking to keep track of your word
            count, a student trying to meet the word limit on an assignment, or
            a professional trying to optimize your content, Text Tally provides
            a user-friendly solution to all your text analysis needs. Try it
            today and take your writing to the next level!
          </p>
          <p className='text-sm'>
            <strong>7. Privacy-Friendly:</strong> At Text Tally, we respect your
            privacy. Your text is processed entirely within your browser and is
            never sent to our servers. This means that once you close the
            browser tab, your text data is completely erased and does not leave
            any footprint. This ensures maximum privacy and confidentiality,
            allowing you to analyze sensitive and confidential documents with
            complete peace of mind.
          </p>
        </div>
      </main>
    </>
  );
}
