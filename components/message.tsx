"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const TextStreamMessage = ({
  content,
}: {
  content: StreamableValue;
}) => {
  const [text] = useStreamableValue(content);

  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Avatar className="h-8 w-8 bg-gradient-to-br from-blue-400 to-blue-600 ring-1 ring-blue-600/20 shadow-md">
        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600" />
      </Avatar>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          <Markdown>{text}</Markdown>
        </div>
      </div>
    </motion.div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <motion.div
      className="flex flex-row gap-4 px-4 w-full md:w-[500px] md:px-0 first-of-type:pt-20"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <Avatar 
        className={`h-8 w-8 shadow-md ${
          role === "assistant" 
            ? "bg-gradient-to-br from-blue-400 to-blue-600 ring-1 ring-blue-600/20" 
            : "bg-gradient-to-br from-orange-400 to-red-500 ring-1 ring-red-500/20"
        }`}
      >
        <AvatarFallback 
          className={`${
            role === "assistant" 
              ? "bg-gradient-to-br from-blue-400 to-blue-600" 
              : "bg-gradient-to-br from-orange-400 to-red-500"
          }`}
        />
      </Avatar>

      <div className="flex flex-col gap-1 w-full">
        <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
          {content}
        </div>
      </div>
    </motion.div>
  );
};