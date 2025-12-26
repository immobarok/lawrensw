"use client";

import { getSnippets } from "@/api/snippet/snippet";
import { useEffect } from "react";


const SnippetInjector = () => {
  useEffect(() => {
    async function loadSnippets() {
      const snippets = await getSnippets();
      //console.log("Injecting snippets:", snippets);

      snippets.forEach((snippet) => {
        if (snippet.content) {
          const div = document.createElement("div");
          div.innerHTML = snippet.content;
          document.head.appendChild(div.firstChild!);
        }
      });
    }
    loadSnippets();
  }, []);

  return null;
};

export default SnippetInjector;
