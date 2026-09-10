"use client";

import { ChatInput } from "@/components/chatInput";
import { MessageBubble } from "@/components/messageBubble";
import { Sidebar } from "@/components/sidebar";
import { useConversations } from "@/hooks/useConverstaion";
import { sendMessage } from "@/lib/api";
import { Message } from "@/types/types";
import { useState } from "react";

export default function Home() {
  // get the useConversation hook
  const {
    conversations,
    loader,
    createConversation,
    getConversation,
    deleteConversation,
    updateConversation,
  } = useConversations();
  // states
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [draftMessage, setDraftMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Derived Values
  const activeConversation = activeId ? getConversation(activeId) : null;

  // handle select function
  const handleSelect = (conversationId: string) => {
    setActiveId(conversationId);
  };

  // handle new chat function
  const handleNewChat = () => {
    setActiveId(null);
    setIsThinking(false);
    setDraftMessage(null);
  };

  // handle delete conversation function
  const handleDelete = (conversationId: string) => {
    // delete the conersation
    deleteConversation(conversationId);
    // check if the current conversation is active or not
    if (conversationId === activeId) {
      setActiveId(null);
      setIsThinking(false);
      setDraftMessage(null);
    }
  };

  // handle send function
  const handleSend = async (text: string) => {
    // set the error to null
    setError(null);
    // save the message in it actual format
    const draft: Message = {
      role: "user",
      content: text,
    };

    // set the draft message to setDraftMessage - it will show the user message instantly
    setDraftMessage(draft);

    // aet thinking indicatior to true - untill model makde a response
    setIsThinking(true);

    // step 4 - try to call the api
    try {
      // step 5 - call the apiu and get the conversationid and reply from the model
      const { conversationId, reply } = await sendMessage(
        text,
        activeId ?? undefined,
      );

      // step 6 - now we have to decide where this chat belongs
      // if the active id iis null then create a new chat
      if (!activeId) {
        // step 7 - call the createConversation method
        createConversation(conversationId, text, reply);
        // Make the newly created conversation the active conversation
        setActiveId(conversationId);
      } else {
        // step 8 - update the conversation if conversation is already exists
        updateConversation(activeId, text, reply);
      }

      // step 9 - both draftMessage and
      setDraftMessage(null);
    } catch (error) {
      // diplay the error
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong. Try again Later!");
      }
    } finally {
      // after evrything set is thinking to false but keep the draft message there
      setIsThinking(false);
    }
  };

  return (
    <>
      <div className="flex h-screen">
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onNewChat={handleNewChat}
        />

        <main className="flex-1 flex flex-col">
          {/* Chat messages  */}
          <div className="flex-1 overflow-y-auto thin-scroll px-4 py-6">
            {/* check if the conversation drfat message and is thinking exists or not, if not then show home screen otherwise show chat */}

            {!activeConversation && !draftMessage && !isThinking ? (
              <div className="flex h-full items-center justify-center">
                <div className=" text-center">
                  <h2 className="font-spaceGrotesk text-3xl text-foreground">
                    What&apos;s on your mind today?
                  </h2>
                  <p className="mt-1 text-sm text-ink-soft font-inter">
                    Training, nutrition, recovery — ask away.
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {/* show existing chat */}
                {activeConversation?.messages?.map((message, index) => (
                  <MessageBubble key={index} message={message} />
                ))}

                {/* show draft message from user */}
                {draftMessage && <MessageBubble message={draftMessage} />}

                {/* show is thinking state */}
                {isThinking && (
                  <div className="text-sm text-ink-soft">Thinking...</div>
                )}

                {/* show error if arrives */}
                {error && <div className="text-sm text-red-500">{error}</div>}
              </div>
            )}
          </div>

          <div className="mx-auto w-full">
            <ChatInput onSend={handleSend} disabled={isThinking} />
          </div>
        </main>
      </div>
    </>
  );
}
