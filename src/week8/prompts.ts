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
