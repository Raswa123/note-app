import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
   
      <div className="flex items-center justify-center min-h-screen p-5 m-5 w-full">
  <div className="md:grid grid-cols-2 gap-10 items-center">
  <div>
    <h1 className="text-blue-700 text-4xl font-bold">Note Hub</h1>
    <h2 className="text-blue-400 text-3xl font-bold">Capture your thoughts!!</h2>
    <p className="text-gray-500 ">Online Notepad is a free browser-based text editor that allows you to create and edit multiple plain-text files in your browser. No registration or login required. It is great for writing quick notes and printing simple pages. What makes it special is the autosave functionality, which saves your draft every second. This prevents data loss in case you accidentally close the tab or the browser window suddenly crashes.</p>
    <Link href={'/login'} className="bg-blue-700 text-white p-2 rounded">Let's Start</Link>
  </div>
      

  <div>
    <Image height={300} width={500} alt="img" src={'https://media.tenor.com/xtFf2a8D2uMAAAAd/writing-notepad.gif'}/>
  </div>
       </div>
       </div>


  );
}
