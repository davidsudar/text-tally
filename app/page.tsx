'use client';

declare global {
  interface Window {
    adsbygoogle: { [key: string]: unknown }[];
  }
}

import { Textarea } from '@/components/ui/textarea';
import { stopWords } from '@/lib/stopwords';
import nlp from 'compromise';
import React, { useEffect, useRef, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);
  const [keyWords, setKeyWords] = useState<
    { word: string; frequency: number }[]
  >([]);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <main className=' grid md:grid-cols-3 min-h-screen px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 2xl:px-32 pt-24 pb-6 transition-colors gap-4'>
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
        {mounted && (
          <>
            <script
              async
              src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6041015149608797'
              crossOrigin='anonymous'></script>

            <ins
              className='adsbygoogle'
              style={{ display: 'block' }}
              data-ad-client='ca-pub-6041015149608797'
              data-ad-slot='1604169203'
              data-ad-format='auto'
              data-full-width-responsive='true'></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
          </>
        )}
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
        <div className='flex flex-col gap-2 w-full col-span-3'>
          <h2 className='text-2xl font-bold'>
            The Importance of Text Analysis
          </h2>
          <p className='text-sm'>
            Text analysis is a powerful tool in our increasingly digital world,
            playing a crucial role in various fields. Its importance spans
            across SEO optimization, academic research, content creation, and
            beyond. By understanding the intricacies of text, we can unlock a
            wealth of insights and opportunities.
          </p>
          <p className='text-sm'>
            In the realm of SEO and digital marketing, effective text analysis
            is key to crafting content that resonates with both search engines
            and human readers. By analyzing keyword density, readability, and
            content structure, marketers can significantly improve their
            website&apos;s search engine rankings, leading to increased
            visibility and organic traffic.
          </p>
          <p className='text-sm'>
            For students, researchers, and academics, text analysis aids in
            maintaining clarity and conciseness in writing. It ensures adherence
            to word limits and enhances the overall readability and impact of
            academic papers, theses, and research publications.
          </p>
          <p className='text-sm'>
            In business and professional communication, understanding the
            nuances of text can lead to more effective marketing strategies,
            clearer internal communications, and better customer engagement.
            From crafting compelling emails to creating persuasive reports, text
            analysis tools like Text Tally offer invaluable assistance.
          </p>
          <p className='text-sm'>
            Text Tally empowers users by providing detailed insights into their
            text&apos;s structure and composition. It&apos;s not just about
            counting words or sentences; it&apos;s about gaining a deeper
            understanding of your text&apos;s quality and effectiveness. Whether
            you&apos;re optimizing a blog post for SEO, writing an academic
            essay, or drafting a business proposal, Text Tally is designed to
            enhance your writing process and help you communicate more
            effectively.
          </p>
          <p className='text-sm'>
            Embrace the power of text analysis with Text Tally and transform the
            way you write, create, and communicate. Dive into a world where
            words are not just mere letters, but keys to unlocking greater
            potential in your content and communication strategies.
          </p>
        </div>
        <div className='flex flex-col gap-2 w-full col-span-3'>
          <h2 className='text-2xl font-bold'>User Guides and Tutorials</h2>
          <p className='text-sm'>
            To get the most out of Text Tally, it&apos;s essential to understand
            its features and how they can be applied in various scenarios. Here,
            we provide some guides and tutorials to help you use Text Tally
            effectively.
          </p>
          <h3 className='text-xl font-bold mt-4'>
            Getting Started with Text Tally
          </h3>
          <p className='text-sm'>
            Begin by entering your text into the provided text area. As you type
            or paste your content, Text Tally immediately begins analyzing the
            data, providing real-time insights into word count, sentence
            structure, and more.
          </p>
          <h3 className='text-xl font-bold mt-4'>Analyzing Keyword Density</h3>
          <p className='text-sm'>
            For SEO purposes, understanding keyword density is crucial. Text
            Tally helps you identify the most frequently used words in your
            text, allowing you to optimize your content for search engines
            effectively.
          </p>
          <h3 className='text-xl font-bold mt-4'>
            Monitoring Word Count for Academic Writing
          </h3>
          <p className='text-sm'>
            For students and academics, adhering to specific word counts is
            often a requirement. Use Text Tally to track your word count
            accurately, ensuring your essays and research papers meet the
            necessary criteria.
          </p>
          <h3 className='text-xl font-bold mt-4'>Enhancing Readability</h3>
          <p className='text-sm'>
            Text Tally isn&apos;t just about counting words; it&apos;s about
            improving the quality of your writing. Use the tool to analyze
            sentence lengths and structures, helping you craft more readable and
            engaging content.
          </p>
        </div>
        <div className='flex flex-col gap-2 w-full col-span-3'>
          <h2 className='text-2xl font-bold'>
            Privacy and Security at Text Tally
          </h2>
          <p className='text-sm'>
            At Text Tally, we deeply value the privacy and security of our
            users. We understand that the text you analyze using our tool can be
            sensitive, confidential, or personal. That&apos;s why we&apos;ve
            implemented robust measures to ensure the highest levels of privacy
            and security.
          </p>
          <p className='text-sm'>
            <strong>Local Processing:</strong> One of the fundamental aspects of
            Text Tally&apos;s approach to privacy is local processing. Your text
            is processed directly within your browser. This means that none of
            your data is ever sent to our servers. All the analysis happens on
            your device, ensuring that your information stays with you and you
            alone.
          </p>
          <p className='text-sm'>
            <strong>No Data Retention:</strong> When you use Text Tally, you can
            be assured that your data is not stored, recorded, or monitored. As
            soon as you close the browser tab, any text you have entered is
            immediately erased from memory. We have no way of retrieving or
            viewing your data, ensuring complete confidentiality.
          </p>
          <p className='text-sm'>
            <strong>Continuous Security Updates:</strong> We are committed to
            maintaining a secure platform. Our team regularly updates Text Tally
            to address any potential security vulnerabilities and to ensure that
            our tool remains safe and reliable for everyone.
          </p>
          <p className='text-sm'>
            <strong>User Control and Transparency:</strong> We believe in giving
            full control to our users. You have complete autonomy over your data
            and how it&apos;s used within Text Tally. There are no hidden
            processes or unclear policies. Transparency is key to our approach
            to privacy and security.
          </p>
          <p className='text-sm'>
            Text Tally is more than just a text analysis tool; it&apos;s a
            platform you can trust. Your privacy and security are our top
            priorities, and we continuously work to uphold these standards. Use
            Text Tally with confidence, knowing that your data remains private,
            secure, and under your control.
          </p>
        </div>
      </main>
    </>
  );
}
