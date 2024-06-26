"use client";

import { Empty } from "@/components/empty";
import { GenerateSoundForm } from "@/components/generate-sound-form";
import Heading from "@/components/heading";
import Loader from "@/components/loader";
import { Music2Icon} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

/**
 * Represents the request payload for generating sound using a pre-trained model.
 */
export interface CreateSoundRequest {
  /**
   * The URL of the pre-trained model to be used for sound generation.
   */
  modelUrl: string;

  /**
   * The input text that will be used to generate the sound.
   */
  text: string;
}

/**
 * The main view component for generating sound using a pre-trained model.
 */
const TextToSpeechPage = () => {
  // State to manage loading status and audio URL
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  /**
   * Handles the process of fetching audio data using the provided request.
   * @param {CreateSoundRequest} request - The request containing model URL and text.
   */
  const handleGetAudio = async (request: CreateSoundRequest) => {
    setIsLoading(true);

    try {
      setAudioUrl(null);
      const response = await fetch("/api/textToSpeech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: request.text,
          modelUrl: request.modelUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio data");
      }

      const data = await response.arrayBuffer();

      const blob = new Blob([data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(blob);

      setAudioUrl(audioUrl);
      setIsLoading(false);
    } catch (error) {
      console.error(error)
      setIsLoading(false);
    }
  };

  const audiobot = useTranslations('audiobot'); 

return (
  <div className="pb-1 md:px-10 px-1 bg-[#b4ded3]">
    <Heading 
      title={audiobot("title")}
      description={audiobot("description")}
      icon={Music2Icon}
      iconcolor="text-emerald-700"
      bgColor="bg-[#77B0AA]"
      />

      <div className="p-4">
        <div className="mb-4">
          <GenerateSoundForm handleGetAudio={handleGetAudio} />
        </div>

        <div className="space-y-4 p-7">
        {isLoading && (
              <div className="p-8 rounded-lg w-full flex items-center justify-center bg-slate-200 shadow-lg shadow-zinc-600">
                  <Loader url="chat_bot_url"/>
              </div>
          )}

          {!audioUrl && !isLoading && (
              <div>
                  <Empty />
              </div>
          )}

          {audioUrl && !isLoading && (
              <div className="text-center bg-slate-300 p-4 rounded-lg">
                  <h1 className="text-center font-bold">Audio Generated By Hugging Faces API!</h1>
              </div>
          )}

          <div className="flex flex-1 justify-center">
              {audioUrl && (
                <audio controls>
                  <source id="audioSource" type="audio/flac" src={audioUrl!} />
                </audio>
              )}
          </div>

          {audioUrl && (
            <div className="text-center bg-slate-300 p-4 rounded-lg">
                <h1 className="text-center font-bold">Go Up & Generate More Audios!</h1>
            </div>
            )} 
        </div>
        </div>
  </div>
  );
}

export default TextToSpeechPage;























 // <div className="flex flex-col md:flex-row h-screen bg-gradient-to-b from-slate-50 to-gray-400">
    //   <div className="w-full md:w-1/3 p-4">
    //     <div className="ml-8 mr-8 mt-4 mb-4 text-xl">
    //     <Heading 
    //         title="AUDIO BANAO"
    //         description="Turn Your Text Prompt Into Beautiful Images"
    //         icon={Music2Icon}
    //         iconcolor="text-emerald-700"
    //         bgColor="bg-emerald-700/10"
    //         />
    //     </div>
    //     {/* Render the form component for generating sound */}
    //     <GenerateSoundForm handleGetAudio={handleGetAudio} />
    //   </div>
    //   <div className="w-full md:w-2/3 p-4 h-screen bg-gradient-to-b from-slate-200 to-gray-400">
    //     <div className="h-full flex justify-center items-center">
    //       {isLoading ? (
    //         // Show loader when fetching audio data
    //         // <GenerateSoundLoader />
    //         <Loader url="baat_cheet_url" />
    //       ) : (
    //         // Display audio player when audio is available
    //         <>
    //           {audioUrl && (
    //             <audio controls>
    //               <source id="audioSource" type="audio/flac" src={audioUrl!} />
    //             </audio>
    //           )}
    //         </>
    //       )}
    //     </div>
    //   </div>
    // </div>
