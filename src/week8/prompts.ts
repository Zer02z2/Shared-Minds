export interface Data {
  text: {
    type: "text"
    data: {
      version: string
      input: {
        prompt: string
        system_prompt?: string
        max_tokens?: number
        min_tokens?: number
      }
    }
  }
  embedding: {
    type: "embedding"
    data: {
      version: string
      input: { inputs: string }
    }
  }
}

export const wordsPrompt = (banList: string[]): Data["text"] => {
  const banWords = banList.join(",")
  const prompt = `Generate two very unrelated random words. Use everyday words that everyone knows. Don't include the following words: ${banWords}. Add a + sign at the beginning and end of your response. Seperate the two words with ,`
  const system_prompt = "You are a helpful AI assistant."
  return {
    type: "text",
    data: {
      version:
        "fbfb20b472b2f3bdd101412a9f70a0ed4fc0ced78a77ff00970ee7a2383c575d",
      input: { prompt, system_prompt },
    },
  }
}

export const sentencePrompt = (
  words: string[],
  number: number
): Data["text"] => {
  const prompt = `Strictly use only ${number} words to connect the word ${
    words[0]
  } and ${words[1]}. ${
    words[0]
  } should be the first word of the phrase or sentence and ${
    words[1]
  } should be the last word of the sentence. Make sure your response contains exactly ${
    number + 2
  } words. Add a + sign at the beginning and end of your response.`
  const system_prompt = `You are a helpful AI assistant. Your response should contain exactly ${
    number + 2
  } words.`
  return {
    type: "text",
    data: {
      version:
        "fbfb20b472b2f3bdd101412a9f70a0ed4fc0ced78a77ff00970ee7a2383c575d",
      input: { prompt, system_prompt },
    },
  }
}

export const embeddingPrompt = (input: string): Data["embedding"] => {
  return {
    type: "embedding",
    data: {
      version:
        "71addf5a5e7c400e091f33ef8ae1c40d72a25966897d05ebe36a7edb06a86a2c",
      input: { inputs: input },
    },
  }
}
