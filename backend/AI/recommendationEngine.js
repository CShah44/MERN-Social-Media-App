import { tokenClassification } from "@huggingface/inference";
import User from "../models/userModel.js";

// V1 recommendation engine - basic

export const getKeywords = async (text) => {
  try {
    const response = await tokenClassification({
      accessToken: process.env.HF_TOKEN,
      model: "yanekyuk/bert-keyword-extractor",
      inputs: text,
    });

    const keywords = response
      .filter((keyword) => keyword.score > 0.7)
      .map((keyword) => JSON.stringify(keyword.word));

    return keywords;
  } catch (error) {
    throw new Error("Could not generate keywords");
  }
};

export const personalizePosts = async (keywords, posts) => {
  const nonMatching = [];

  const sorted = await posts.filter((post) => {
    const postContent = JSON.stringify(post.text).toLowerCase();
    if (
      keywords.some((keyword) => postContent.includes(keyword.toLowerCase()))
    ) {
      return true;
    }
    nonMatching.push(post);
  });

  return [...sorted, ...nonMatching];
};

export const updateKeywordsFromText = async (userId, text) => {
  if (!text) return;

  try {
    const user = await User.findById(userId);

    //get and format the new keywords
    const newKeywords = await getKeywords(text);
    const formatted = newKeywords.map((n) => JSON.parse(n));

    // get the old keywords
    const oldKeywords = user.keywords;

    //filter the new keywords such that there are no duplicates
    const uniqueKeywords = formatted.filter((keyword) => {
      return !user.keywords.includes(keyword);
    });

    user.keywords = [...uniqueKeywords, ...oldKeywords];

    await user.save();
  } catch (error) {
    throw new Error(error);
  }
};
