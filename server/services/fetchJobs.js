const axios = require("axios");
const { parseStringPromise } = require("xml2js");

const sanitizeXml = (xml) => {
  return xml.replace(/(\s\w+)=([ >])/g, '$1=""$2');
};

const fetchJobs = async (url) => {
  try {
    const xmlRaw = await axios.get(url);
    const sanitizedXml = sanitizeXml(xmlRaw.data);
    const parsed = await parseStringPromise(sanitizedXml);

    const items = parsed?.rss?.channel?.[0]?.item || [];
    console.log(
      `Fetched ${items.length} jobs at ${new Date().toLocaleString()}`,
      items[0]
    );
    return items;
  } catch (err) {
    console.error("Error fetching jobs:", err.message);
    return [];
  }
};

module.exports = { fetchJobs };
