const axios = require("axios");
const xml2js = require("xml2js");

const fetchJobs = async (url) => {
  const { data } = await axios.get(url);
  const parsed = await xml2js.parseStringPromise(data, {
    explicitArray: false
  });

  console.log("parsed", parsed);

  return parsed.rss.channel.item;
};

module.exports = { fetchJobs };
